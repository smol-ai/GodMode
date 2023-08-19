const Provider = require('./provider');

class InflectionPi extends Provider {
	static webviewId = 'webviewInflection';
	static fullName = 'Inflection Pi';
	static shortName = 'InflectionPi';

	static url = 'https://pi.ai/talk/';

	static handleInput(input) {
		const fullName = this.fullName;
		this.getWebview().executeJavaScript(`{
        var inputElement = document.querySelector('.text-muted textarea');
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
    // this does not work yet.. how to fix?
		this.getWebview().executeJavaScript(`{
      
      var inputElement = document.querySelector('.text-muted textarea');
      const event = new KeyboardEvent('keyup', {
        key: 'Enter',
        metaKey: true
      });
      inputElement.dispatchEvent(event);
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

module.exports = YouChat;
