const Store = require('electron-store');
const store = new Store();

const Provider = require('./provider');

class OpenAi extends Provider {
	static webviewId = 'webviewOAI';
  	static fullName = 'OpenAI ChatGPT';

	static url = 'https://chat.openai.com/?model=gpt-4-code-interpreter'; // TODO - let people switch

	static handleInput(input) {
		this.getWebview().executeJavaScript(`
        function simulateUserInput(element, text) {
          const inputEvent = new Event('input', { bubbles: true });
          element.focus();
          element.value = text;
          element.dispatchEvent(inputEvent);
        }
        var inputElement = document.querySelector('textarea[placeholder*="Send a message"]');
        simulateUserInput(inputElement, "${input}");
      `);
	}

	static handleSubmit(input) {
		this.getWebview().executeJavaScript(`
        var btn = document.querySelector("textarea[placeholder*='Send a message']+button");
        btn.focus();
        btn.disabled = false;
        btn.click();
      `);
	}

	static handleCss() {
		this.getWebview().addEventListener('dom-ready', () => {
      // hide message below text input, sidebar, suggestions on new chat
			this.getWebview().insertCSS(`
          .text-xs.text-center {
            opacity: 0;
            height: 0;
            margin-bottom: -10px;
          }

          .sticky,
          .pointer-events-auto.flex.border-orange-500,
          [class*="shared__Capabilities"] {
            display: none !important;
          }

          [class*="shared__Wrapper"] {
            align-items: center;
            justify-content: center;
            text-align: center;
            margin-top: 15vh;
          }

          [class*="shared__Wrapper"] h3 {
            margin-top: -40px;
            font-size: 20px;
          }

          .flex-shrink-0.flex.flex-col.relative.items-end {
            display: none !important;
          }

        `);
		});
	}

  static isEnabled() {
		return store.get(`${this.webviewId}Enabled`, true);
	}
}

module.exports = OpenAi;
