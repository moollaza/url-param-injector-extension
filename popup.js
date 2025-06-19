const statusDiv = document.getElementById("status");
const rulesListDiv = document.getElementById("rules-list");
let allRules = [];

function saveRules() {
  chrome.storage.local.set({ rules: allRules });
}

function renderNoRules() {
  statusDiv.textContent = "No active rules for this page.";
  rulesListDiv.innerHTML = "";
}

function renderRules(activeRules) {
  statusDiv.textContent = "Active rules for this page:";
  rulesListDiv.innerHTML = "";

  activeRules.forEach((activeRule) => {
    // Find the index of the rule in the global allRules array
    const ruleIndex = allRules.findIndex((r) => r.domain === activeRule.domain);

    const ruleDiv = document.createElement("div");
    ruleDiv.className = "rule";

    const domainP = document.createElement("p");
    domainP.className = "domain";
    domainP.textContent = activeRule.domain;
    ruleDiv.appendChild(domainP);

    activeRule.params.forEach((param, paramIndex) => {
      const paramDiv = document.createElement("div");
      paramDiv.className = "param";
      
      const keyInput = document.createElement("input");
      keyInput.type = "text";
      keyInput.value = param.key;
      keyInput.disabled = true; // Keys are not editable from the popup for simplicity

      const valueInput = document.createElement("input");
      valueInput.type = "text";
      valueInput.value = param.value;
      valueInput.placeholder = "Value";
      valueInput.addEventListener("change", (e) => {
        // Update the value in the main rules array
        allRules[ruleIndex].params[paramIndex].value = e.target.value;
        saveRules();
      });

      paramDiv.appendChild(keyInput);
      paramDiv.appendChild(valueInput);
      ruleDiv.appendChild(paramDiv);
    });

    rulesListDiv.appendChild(ruleDiv);
  });
}

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const currentTab = tabs[0];
  if (currentTab && currentTab.url) {
    const url = new URL(currentTab.url);
    const hostname = url.hostname;

    chrome.storage.local.get("rules", ({ rules }) => {
      if (rules && rules.length > 0) {
        allRules = rules;
        const activeRules = allRules.filter((rule) =>
          hostname.includes(rule.domain)
        );

        if (activeRules.length > 0) {
          renderRules(activeRules);
        } else {
          renderNoRules();
        }
      } else {
        renderNoRules();
      }
    });
  } else {
    statusDiv.textContent = "Could not determine current tab URL.";
  }
});
