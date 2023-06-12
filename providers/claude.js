const Store = require('electron-store');
const store = new Store();

const Provider = require('./provider');

class Claude extends Provider {
	static webviewId = 'webviewCLAUDE';

	static url = 'https://console.anthropic.com/chat/new';

	static handleInput(input) {
		this.getWebview().executeJavaScript(`
    var inputElement = document.querySelector('div.ProseMirror')
    inputElement.innerHTML = "${input}"`);
	}

	static handleSubmit(input) {
		this.getWebview().executeJavaScript(`
    var btn = document.querySelector('div.group.flex.p-3 button:has(svg)'); // YES we are using the has selector!!!!
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