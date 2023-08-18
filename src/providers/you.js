const Provider = require('./provider');

class YouChat extends Provider {
	static webviewId = 'webviewYoudotcom';
	static fullName = 'You.com Chat';
	static shortName = 'You.com';

	static url = 'https://you.com/chat/';

	static handleInput(input) {
		const fullName = this.fullName;
		this.getWebview().executeJavaScript(`{
        var inputElement = document.querySelector('textarea[placeholder*="Ask me anything..."]'); // can be "Ask anything" or "Ask follow-up"
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
    var buttons = Array.from(document.querySelectorAll('button[type="submit"]'));
    buttons[0].click();
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
