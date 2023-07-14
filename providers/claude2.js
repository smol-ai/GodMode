const Store = require('electron-store');
const store = new Store();

const Provider = require('./provider');

class Claude2 extends Provider {
	static webviewId = 'webviewCLAUDE2';
  static fullName = 'Anthropic Claude 2';


	static url = 'https://claude.ai/chats/';

	static handleInput(input) {
		this.getWebview().executeJavaScript(`
    var inputElement = document.querySelector('div.ProseMirror')
    inputElement.innerHTML = "${input}"`);
	}

	static handleSubmit() {
		this.getWebview().executeJavaScript(`
		var btn = document.querySelector("button[aria-label*='Send Message']"); // subsequent screens use this
    if (!btn) var btn = document.querySelector('button:has(div svg)'); // new chats use this
    if (!btn) var btn = document.querySelector('button:has(svg)'); // last ditch attempt
		btn.focus();
    btn.disabled = false;
    btn.click()`);
	}

	static handleCss() {
		this.getWebview().addEventListener('dom-ready', () => {
			// hide message below text input, sidebar, suggestions on new chat
			setTimeout(() => {
				this.getWebview().insertCSS(`
				/* black background */
				body {
					background-color: #1d1d1d !important;
					color: #d7d7d7 !important;
				}
				/* reset text colors for user input and history displays */
				fieldset {
					color: black !important;
				}
				div[cmdk-group-items] {
					color: black !important;
				}

				/* messages */
				.text-stone-900.bg-white {
					background-color: #1d1d1d !important;
					color: #d7d7d7 !important;
				}

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

				body {
					background-color: #1e1e1e;
					color: #fff;
				}

				/* Dark input field */
				fieldset {
					background-color: #222 !important;
					color: white !important;
					border-radius: 0px;
				}
				/* Placeholder text */
				.ProseMirror[data-placeholder]:before {
					color: #6c757d !important;
				}

				/* Input text */
				.ProseMirror {
					color: white !important;
				}

				/* Attachment button */
				label {
					background-color: #1d1d1d !important;
				}
				label]:hover {
					background-color: #444 !important;
				}

				/* Simplify and set to dark mode the chat history on initial prompt */
				div[role="listbox"] div[cmdk-item] {
					background-color: #222;
					color:white;
					border: 0px;
					border-radius: 0px;
				}
				.shadow-element {
					box-shadow: none !important;
				}
				div[role="listbox"] div[cmdk-item]:hover {
					background-color: #444;
				}
        `);
			}, 1000);
			setTimeout(() => {
				this.getWebview().executeJavaScript(`
				// hide welcome back title
				document.querySelector('h2').style.display = 'none';
				`);
			}, 1000);
		});
	}

	static getUserAgent() {
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
	}

	static isEnabled() {
		return store.get(`${this.webviewId}Enabled`, true);
	}
}

module.exports = Claude2;