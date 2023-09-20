const Provider = require('./provider');

class InflectionPi extends Provider {
	static webviewId = 'webviewInflection';
	static fullName = 'Inflection Pi';
	static shortName = 'InflectionPi';

	static url = 'https://pi.ai/talk/';

	static handleInput(input) {
		this.getWebview().executeJavaScript(`{
        var inputElement = document.querySelector('textarea[placeholder="Talk with Pi"]');
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
      var inputElement = document.querySelector('textarea[placeholder="Talk with Pi"]');
			if (inputElement) {
				const event = new KeyboardEvent('keydown', {
					key: 'Enter',
					view: window,
					bubbles: true
				});
				inputElement.dispatchEvent(event);
			}
  }`);
	}
	static handleCss() {
		// this.getWebview().addEventListener('dom-ready', () => {
		// 	// Hide the "Try asking" segment
		// 	setTimeout(() => {
		// 		this.getWebview().insertCSS(`
		//     .mt-lg {
		//       display: none;
		//     }
		//     `);
		// 	}, 100);
		// });
	}

	static isEnabled() {
		return window.electron.electronStore.get(`${this.webviewId}Enabled`, false);
	}
}

module.exports = InflectionPi;
