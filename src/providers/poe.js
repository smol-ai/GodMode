const Provider = require('./provider');

class Poe extends Provider {
	static webviewId = 'webviewPoe';
	static fullName = 'Quora Poe';
	static shortName = 'Poe';

	static url = 'https://poe.com/';

	static handleInput(input) {
		const fullName = this.fullName;
		this.getWebview().executeJavaScript(`{
        var inputElement = document.querySelector('textarea');
        if (!inputElement) {
          console.error('inputElement for ${fullName} doesnt exist, have you logged in or are you on the right page?')
        } else {
					var nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
					nativeTextAreaValueSetter.call(inputElement, \`${input}\`);

					var event = new Event('input', { bubbles: true});
					inputElement.dispatchEvent(event);
        }
    }`);
	}

	static handleSubmit() {
		this.getWebview().executeJavaScript(`{
        var buttons = Array.from(document.querySelectorAll('button.Button_primary__pIDjn'));
        var button = buttons[buttons.length - 1];
        button.click();
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
