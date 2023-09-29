const Provider = require('./provider');

class Poe extends Provider {
	static webviewId = 'webviewPoe';
	static fullName = 'Quora Poe';
	static shortName = 'Poe';

	static url = 'https://poe.com/';

	static handleInput(input) {
		this.getWebview().executeJavaScript(`{
        var inputElement = document.querySelector('textarea');
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
        var button = document.querySelectorAll('button[class*="ChatMessageSendButton_sendButton"]')[0]
				if (button) {
					button.click();
				}
    }`);
	}

	static handleCss() {
		this.getWebview().addEventListener('dom-ready', () => {
			// hide message below text input, sidebar, suggestions on new chat
			setTimeout(() => {
				this.getWebview().executeJavaScript(`
          `);
			}, 100);
			// Hide the "Try asking" segment
			setTimeout(() => {
				this.getWebview().insertCSS(`
        .mt-lg {
          display: none;
        }
		    `);
			}, 100);
		});
	}

	static isEnabled() {
		return window.electron.electronStore.get(`${this.webviewId}Enabled`, true);
	}
}

module.exports = Poe;
