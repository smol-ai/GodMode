const Provider = require('./provider');

class OobaBooga extends Provider {
	static webviewId = 'webviewOoba';
	static fullName = 'Local Models (OobaBooga)';

	static url = 'http://127.0.0.1:7860/';

	// todo: let user customize their preferred template.
	static templateFn = (input) => `Common sense questions and answers

  Question: ${input}
  Factual answer:`;

	static handleInput(input) {
		this.getWebview().executeJavaScript(`
        function simulateUserInput(element, text) {
          const inputEvent = new Event('input', { bubbles: true });
          element.focus();
          element.value = text;
          element.dispatchEvent(inputEvent);
        }
        try {
          var inputElement = document.querySelector('#main textarea');
          simulateUserInput(inputElement, \`${this.templateFn(input)}\`);
        } catch (err) {
          console.error(err);
          console.error(err.toString());
          console.log(\`${this.templateFn(input)}\`);
          console.error(err);
        }
      `);
	}

	static handleSubmit() {
		this.getWebview().executeJavaScript(`
        var btn = document.querySelector("button.primary")
        btn.focus();
        btn.disabled = false;
        btn.click();
      `);
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
