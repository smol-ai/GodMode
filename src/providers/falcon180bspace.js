const Provider = require('./provider');

class Falcon180BSpace extends Provider {
	static webviewId = 'webviewFalcon180BSpace';
	static fullName = 'Falcon 180B (HF Space, temporary)';
	static shortName = 'Falcon180BSpace';

	static url = 'https://tiiuae-falcon-180b-demo.hf.space/?__theme=dark';

	static handleInput(input) {
		this.getWebview().executeJavaScript(`{
        var inputElement = document.querySelector('textarea[data-testid="textbox"]');
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
			var btn = document.querySelector('button.primary');
			if (btn) {
				btn.focus();
				btn.disabled = false;
				btn.click();
			}
  }`);
	}
	static handleCss() {
		this.getWebview().addEventListener('dom-ready', () => {
			// Hide the "Try asking" segment
			setTimeout(() => {
				this.getWebview().insertCSS(`
		    div[data-testid="markdown"] {
		      display: none;
		    }
				#banner-image {
					height: 30px;
				}
		    `);
			}, 100);
		});
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

module.exports = Falcon180BSpace;
