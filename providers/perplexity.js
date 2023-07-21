const Store = require('electron-store');
const store = new Store();

const Provider = require('./provider');

class Perplexity extends Provider {
	static webviewId = 'webviewPerplexity';
	static fullName = 'Perplexity';

	static url = 'https://www.perplexity.ai/';

	static handleInput(input) {
		this.getWebview().executeJavaScript(`
        function simulateUserInput(element, text) {
          const inputEvent = new Event('input', { bubbles: true });
          element.focus();
          element.value = text;
          element.dispatchEvent(inputEvent);
        }
        var inputElement = document.querySelector('textarea[placeholder*="Ask anything"]');
        simulateUserInput(inputElement, "${input}");
      `);
	}

	static handleSubmit() {
		this.getWebview().executeJavaScript(`
        var btn = document.querySelector('button.bg-super.aspect-square');
        btn.click();
      `);
	}

	static handleCss() {
		this.getWebview().addEventListener('dom-ready', () => {
			// hide message below text input, sidebar, suggestions on new chat
        setTimeout(() => {
          this.getWebview().executeJavaScript(`
          // Add Dark Mode
          document.documentElement.classList.add('dark');

          `);
        }, 100);
		});
	}

	static isEnabled() {
		return store.get(`${this.webviewId}Enabled`, false);
	}
}

module.exports = Perplexity;
