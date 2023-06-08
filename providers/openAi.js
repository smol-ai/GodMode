function getWebviewInputHandler(webviewOAI) {
  return function (event) {
    const promptEl = event.target;
    const sanitizedInput = promptEl.value.replace(/"/g, '\\"').replace(/\n/g, '\\n');
    webviewOAI.executeJavaScript(`
      function simulateUserInput(element, text) {
        const inputEvent = new Event('input', { bubbles: true });
        element.focus();
        element.value = text;
        element.dispatchEvent(inputEvent);
      }
      var inputElement = document.querySelector('textarea[placeholder*="Send a message"]');
      simulateUserInput(inputElement, "${sanitizedInput}");
    `);
  };
}

function getWebviewSubmitHandler(webviewOAI) {
  return function (event) {
    const promptEl = event.target.elements[0];
    const sanitizedInput = promptEl.value.replace(/"/g, '\\"').replace(/\n/g, '\\n');
    webviewOAI.executeJavaScript(`
      var btn = document.querySelector("textarea[placeholder*='Send a message']+button");
      btn.disabled = false;
      btn.click();
    `);
  };
}

function setupWebviewOAI(webviewOAI) {
  return {
    handleInput: getWebviewInputHandler(webviewOAI),
    handleSubmit: getWebviewSubmitHandler(webviewOAI),
  };
}

module.exports = { setupWebviewOAI };
