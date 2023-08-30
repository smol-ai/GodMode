const Provider = require('./provider');

class OpenRouter extends Provider {
	static webviewId = 'webviewOpenRouter';
	static fullName = 'OpenRouter Playground';
	static shortName = 'OpenRouter';

	static url = 'https://openrouter.ai/playground';

	static handleInput(input) {
		this.getWebview().executeJavaScript(`{
        var inputElement = document.querySelector('textarea[placeholder*="Chat or prompt"]'); // can be "Ask anything" or "Ask follow-up"
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
    var buttons = Array.from(document.querySelectorAll('button'));
		if (buttons[0]) {
			var buttonsWithSVGOnly = buttons.filter(button => {
				var svg = button.querySelector('svg');
				return !!svg;
			});

			if (buttonsWithSrOnly.length == 1){
				var button = buttonsWithSrOnly[0];
				button.click();
			}
		}
  }`);
	}
	static handleCss() {
		this.getWebview().addEventListener('dom-ready', () => {
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
		return window.electron.electronStore.get(`${this.webviewId}Enabled`, false);
	}
}

module.exports = OpenRouter;
