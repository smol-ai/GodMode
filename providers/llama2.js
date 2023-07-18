const Store = require('electron-store');
const store = new Store();

const Provider = require('./provider');

class Claude extends Provider {
	static webviewId = 'webviewLLAMA2';
  static fullName = 'Llama 2 (via Replicate)';


	static url = 'https://www.llama2.ai/';

	static handleInput(input) {
		this.getWebview().executeJavaScript(`
    function simulateUserInput(element, text) {
      const inputEvent = new Event('input', { bubbles: true });
      element.focus();
      element.value = text;
      element.dispatchEvent(inputEvent);
    }
    var inputElement = document.querySelector('textarea[placeholder*="LLaMA2"]');
    simulateUserInput(inputElement, "${input}");`);
	}

	static handleSubmit() {
		this.getWebview().executeJavaScript(`
    var btn = document.querySelector('.stChatInputContainer button:has(svg)'); // YES we are using the has selector!!!!
    btn.focus();
    btn.disabled = false;
    btn.click()`);
	}

	static handleCss() {
		this.getWebview().addEventListener('dom-ready', () => {
			// hide message below text input, sidebar, suggestions on new chat
			setTimeout(() => {
				this.getWebview().insertCSS(`
        header, .container {
          background-color: white;
          /* single line dark mode ftw */
          filter: invert(100%) hue-rotate(180deg);
        }
        /* hide the claude avatar in response */
        .p-1.w-9.h-9.shrink-0 {
          display: none;
        }
        /* reduce claude prompt margins */
        .mx-4.md\:mx-12.mb-2.md\:mb-4.mt-2.w-auto {
          margin: 0 !important;
        }
        `);
			}, 1000);
		});
	}

	static isEnabled() {
		return store.get(`${this.webviewId}Enabled`, false);
	}
}

module.exports = Claude;