const Provider = require('./provider');

class OobaBooga extends Provider {
	static webviewId = 'webviewOoba';
	static fullName = 'Local Models (OobaBooga)';
	static shortName = 'Oobabooga';

	static url = 'http://127.0.0.1:7860/';

	// todo: let user customize their preferred template.
	static templateFn = (input) => `Common sense questions and answers

  Question: ${input}
  Factual answer:`;

	static handleInput(input) {
		this.getWebview().executeJavaScript(`{
        var inputElement = document.querySelector('#main textarea');
        if (!inputElement) {
          console.error('inputElement for ${
						this.fullName
					} doesnt exist, have you logged in or are you on the right page?')
        } else {
          const inputEvent = new Event('input', { bubbles: true });
          inputElement.value = \`${this.templateFn(
						input,
					)}\`; // must be escaped backticks to support multiline
          inputElement.dispatchEvent(inputEvent);
        }
      }`);
	}

	static handleSubmit() {
		this.getWebview().executeJavaScript(`{
        var btn = document.querySelector("button.primary")
        btn.focus();
        btn.disabled = false;
        btn.click();
    }`);
	}

	static handleCss() {
		this.getWebview().addEventListener('dom-ready', () => {
			// hide message below text input, sidebar, suggestions on new chat
			this.getWebview().insertCSS(`
      `);
		});
	}

	static isEnabled() {
		return window.electron.electronStore.get(`${this.webviewId}Enabled`, false);
	}
}

module.exports = OobaBooga;
