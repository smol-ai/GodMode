const Provider = require('./provider');

class Together extends Provider {
	static webviewId = 'webviewTOGETHER';
	static fullName = 'Together (RedPajama, StarCoder, Falcon, etc)';
	static shortName = 'Together';

	static url = 'https://api.together.xyz/playground/chat';

	static handleInput(input) {
		const fullName = this.fullName;
		this.getWebview().executeJavaScript(`{
			var inputElement = document.querySelector('form textarea[placeholder*="Enter text here"]');
			if (inputElement) {
				var nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
				nativeTextAreaValueSetter.call(inputElement, \`${input}\`);
				var event = new Event('input', { bubbles: true});
				inputElement.dispatchEvent(event);
			}
    }`);
	}

	static handleSubmit() {
		this.getWebview().executeJavaScript(`{
    var btn = document.querySelector('button[data-cy="run-inference-button"]'); // YES we are using the has selector!!!!
		if (btn) {
			btn.focus();
			btn.disabled = false;
			btn.click()
		}
  }`);
	}

	static handleCss() {
		this.getWebview().addEventListener('dom-ready', () => {
			// hide message below text input, sidebar, suggestions on new chat
			setTimeout(() => {
				this.getWebview().insertCSS(`
		    header, header + div {
		      background-color: white;
		      /* single line dark mode ftw */
		      filter: invert(100%) hue-rotate(180deg);
		    }
        header {
          height: 10px;
          margin-top: -5px;
          padding-top: 0px;
          padding-bottom: 0px;
        }
        /* the "chat" header is pretty big */
        .mui-style-qe6v0i {
          padding-top: 0px;
        }
        div + h1, h1, h1 + div {
          display: none;
        }
		    `);
			}, 100);
		});
	}

	static isEnabled() {
		return window.electron.electronStore.get(`${this.webviewId}Enabled`, false);
	}
}

module.exports = Together;
