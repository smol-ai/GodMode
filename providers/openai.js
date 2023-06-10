const Store = require('electron-store');
const store = new Store();

const Provider = require('./provider');

class OpenAi extends Provider {
	static webviewId = 'webviewOAI';
	static webview = document.getElementById('webviewOAI');

	static url = 'https://chat.openai.com/chat';

	static handleInput(input) {
		this.webview.executeJavaScript(`
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
		this.webview.executeJavaScript(`
        var btn = document.querySelector("textarea[placeholder*='Send a message']+button");
        btn.disabled = false;
        btn.click();
      `);
	}

	static handleCss() {
		this.webview.addEventListener('dom-ready', () => {
			// hide message below text input, sidebar, suggestions on new chat
			this.webview.insertCSS(`
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