// options.js

const rulesContainer = document.getElementById("rules-container");
const addRuleBtn = document.getElementById("add-rule");

let rules = [];

function saveRules() {
  chrome.storage.local.set({ rules });
}

function renderRules() {
  rulesContainer.innerHTML = "";
  rules.forEach((rule, ruleIndex) => {
    const ruleDiv = document.createElement("div");
    ruleDiv.className = "rule";

    const domainInput = document.createElement("input");
    domainInput.type = "text";
    domainInput.value = rule.domain;
    domainInput.placeholder = "Domain (e.g., duck.co)";
    domainInput.addEventListener("change", (e) => {
      rules[ruleIndex].domain = e.target.value;
      saveRules();
    });

    const paramsDiv = document.createElement("div");
    rule.params.forEach((param, paramIndex) => {
      const paramDiv = document.createElement("div");
      paramDiv.className = "param";

      const keyInput = document.createElement("input");
      keyInput.type = "text";
      keyInput.value = param.key;
      keyInput.placeholder = "Key";
      keyInput.addEventListener("change", (e) => {
        rules[ruleIndex].params[paramIndex].key = e.target.value;
        saveRules();
      });

      const valueInput = document.createElement("input");
      valueInput.type = "text";
      valueInput.value = param.value;
      valueInput.placeholder = "Value";
      valueInput.addEventListener("change", (e) => {
        rules[ruleIndex].params[paramIndex].value = e.target.value;
        saveRules();
      });

      const overrideCheckbox = document.createElement("input");
      overrideCheckbox.type = "checkbox";
      overrideCheckbox.title = "Override existing parameter";
      overrideCheckbox.checked = param.override !== false;
      overrideCheckbox.addEventListener("change", (e) => {
        rules[ruleIndex].params[paramIndex].override = e.target.checked;
        saveRules();
      });

      const removeParamBtn = document.createElement("button");
      removeParamBtn.textContent = "Remove Param";
      removeParamBtn.className = "remove-param";
      removeParamBtn.addEventListener("click", () => {
        rules[ruleIndex].params.splice(paramIndex, 1);
        saveRules();
        renderRules();
      });

      paramDiv.appendChild(keyInput);
      paramDiv.appendChild(valueInput);
      paramDiv.appendChild(overrideCheckbox);
      paramDiv.appendChild(removeParamBtn);
      paramsDiv.appendChild(paramDiv);
    });

    const addParamBtn = document.createElement("button");
    addParamBtn.textContent = "Add Param";
    addParamBtn.addEventListener("click", () => {
      rules[ruleIndex].params.push({ key: "", value: "", override: true });
      saveRules();
      renderRules();
    });

    const removeRuleBtn = document.createElement("button");
    removeRuleBtn.textContent = "Remove Rule";
    removeRuleBtn.className = "remove-rule";
    removeRuleBtn.addEventListener("click", () => {
      rules.splice(ruleIndex, 1);
      saveRules();
      renderRules();
    });

    ruleDiv.appendChild(domainInput);
    ruleDiv.appendChild(paramsDiv);
    ruleDiv.appendChild(addParamBtn);
    ruleDiv.appendChild(removeRuleBtn);
    rulesContainer.appendChild(ruleDiv);
  });
}

addRuleBtn.addEventListener("click", () => {
  rules.push({ domain: "", params: [{ key: "", value: "", override: true }] });
  renderRules();
  // Note: we don't save here, because the domain is empty.
  // The user will fill it and the change event will save.
});

chrome.storage.local.get("rules", (data) => {
  if (data.rules) {
    // Migrate old rules
    data.rules.forEach((rule) => {
      rule.params.forEach((param) => {
        if (param.override === undefined) {
          param.override = true;
        }
      });
    });
    rules = data.rules;
    renderRules();
  }
});
