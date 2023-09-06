const Provider = require('./provider');

class StableChat extends Provider {
	static webviewId = 'webviewStableChat';
	static fullName = 'Stable Chat (Stability AI)';
	static shortName = 'StableChat';

	static url = 'https://chat.stability.ai';

	static handleInput(input) {
		this.getWebview().executeJavaScript(`{
        var inputElement = document.querySelector('textarea[placeholder="Type something here..."]');
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
			var btn = document.querySelector('textarea[placeholder="Type something here..."] + button');
			if (btn) {
				btn.focus();
				btn.disabled = false;
				btn.click();
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
	static handleDarkMode(isDarkMode) {
		if (isDarkMode) {
			this.getWebview().executeJavaScript(`{
				if(document.querySelector('html').dataset.theme === 'light'){
					document.querySelector('.menu > ul > div:nth-child(2) > button').click()
      		}
		}
			`);
		} else {
			this.getWebview().executeJavaScript(`{
				if(document.querySelector('html').dataset.theme === 'business'){
					document.querySelector('.menu > ul > div:nth-child(2) > button').click()
      		}
      	}
			`);
		}
	}

	static isEnabled() {
		return window.electron.electronStore.get(`${this.webviewId}Enabled`, false);
	}
}

module.exports = StableChat;
