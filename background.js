// background.js

function log(message, ...args) {
  console.log(`[URL Params Injector] ${message}`, ...args);
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function updateRules(rules) {
  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
  const existingRuleIds = existingRules.map((rule) => rule.id);

  const newRules = [];
  // Start rule ID counter from the highest existing ID + 1 to avoid conflicts
  let ruleIdCounter =
    existingRuleIds.length > 0 ? Math.max(...existingRuleIds) + 1 : 1;

  if (rules) {
    for (const rule of rules) {
      if (!rule.domain) continue;

      const overrideParams = rule.params.filter(
        (p) => p.override !== false && p.key
      );
      const noOverrideParams = rule.params.filter(
        (p) => p.override === false && p.key
      );

      if (overrideParams.length > 0) {
        newRules.push({
          id: ruleIdCounter++,
          priority: 1,
          action: {
            type: "redirect",
            redirect: {
              transform: {
                queryTransform: {
                  addOrReplaceParams: overrideParams.map(({ key, value }) => ({
                    key,
                    value,
                  })),
                },
              },
            },
          },
          condition: {
            urlFilter: `||${rule.domain}/`,
            resourceTypes: ["main_frame"],
          },
        });
      }

      for (const param of noOverrideParams) {
        newRules.push({
          id: ruleIdCounter++,
          priority: 2, // Higher priority to be evaluated first
          action: {
            type: "redirect",
            redirect: {
              transform: {
                queryTransform: {
                  addOrReplaceParams: [{ key: param.key, value: param.value }],
                },
              },
            },
          },
          condition: {
            urlFilter: `||${rule.domain}/`,
            resourceTypes: ["main_frame"],
            // This regex matches URLs that DO NOT contain the query parameter
            regexFilter: `^((?![?&]${escapeRegex(param.key)}=).)*$`,
          },
        });
      }
    }
  }

  log("Removing all old rules.");
  log("Adding new rules:", JSON.stringify(newRules, null, 2));

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: existingRuleIds,
    addRules: newRules,
  });

  log("Rules updated successfully.");
}

chrome.runtime.onInstalled.addListener(() => {
  log("Extension installed");
  chrome.storage.local.get("rules", ({ rules }) => {
    if (rules) {
      updateRules(rules);
    } else {
      // Add default rule for the user
      const defaultRules = [
        {
          domain: "use-serp-dev-testing8.duck.co",
          params: [
            { key: "ddg_accounts_experiment", value: "1", override: true },
          ],
        },
      ];
      chrome.storage.local.set({ rules: defaultRules }, () => {
        updateRules(defaultRules);
      });
    }
  });
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "local" && changes.rules) {
    log("Rules changed, updating...");
    updateRules(changes.rules.newValue);
  }
});
