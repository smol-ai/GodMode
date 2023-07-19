const Store = require('electron-store');
const store = new Store();

const Provider = require('./provider');

class HuggingChat extends Provider {
	static webviewId = 'webviewHuggingChat';
	static fullName = 'HuggingChat';

	static url = 'https://huggingface.co/chat/';

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
        var btn = document.querySelector('form.relative > div > button[type="submit"]');
        btn.click();
      `);
	}

	static handleCss() {
		this.getWebview().addEventListener('dom-ready', () => {
			// hide message below text input, sidebar, suggestions on new chat
			this.getWebview().insertCSS(`
          div:contains("Examples") {
            display: none !important;
          }

        `);
        setTimeout(() => {
          this.getWebview().executeJavaScript(`
          // Get the root element
          // const root = document.querySelector(':root');

          // Set the color-scheme CSS variable
          // root.style.setProperty('--color-scheme', 'dark');

          // Add the .dark class to the body
          // document.body.classList.add('dark');

          `);
        }, 0);
		});
	}

	static isEnabled() {
		return store.get(`${this.webviewId}Enabled`, true);
	}
}

module.exports = HuggingChat;
