// background.js

function log(message) {
  console.log(`[URL Params Injector] ${message}`);
}

async function updateRules(rules) {
  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
  const existingRuleIds = existingRules.map((rule) => rule.id);

  const rulesToRemove = existingRuleIds;
  const rulesToAdd = rules.map((rule, index) => ({
    id: index + 1,
    priority: 1,
    action: {
      type: "redirect",
      redirect: {
        transform: {
          queryTransform: {
            addOrReplaceParams: rule.params,
          },
        },
      },
    },
    condition: {
      urlFilter: `||${rule.domain}/`,
      resourceTypes: ["main_frame"],
    },
  }));

  log(`Removing rules: ${rulesToRemove.join(", ")}`);
  log("Adding new rules:", JSON.stringify(rulesToAdd, null, 2));

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: rulesToRemove,
    addRules: rulesToAdd,
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
          params: [{ key: "ddg_accounts_experiment", value: "1" }],
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
