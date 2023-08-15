const Provider = require('./provider');

class PerplexityLlama extends Provider {
	static webviewId = 'webiewPerplexityLlama';
	static fullName = 'Llama 2 (via Perplexity)';

	static url = 'https://labs.perplexity.ai/';

	static handleInput(input) {
		try {
			this.getWebview().executeJavaScript(`{
        var inputElement = document.querySelector('textarea[placeholder*="Ask"]'); // can be "Ask anything" or "Ask follow-up"
        var nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
        nativeTextAreaValueSetter.call(inputElement, \`${input}\`);

        var event = new Event('input', { bubbles: true});
        inputElement.dispatchEvent(event);
		}`);
		} catch (e) {
			console.debug('Error in PerplexityLlama.handleInput():', e);
		}
	}

	static handleSubmit() {
		try {
			this.getWebview().executeJavaScript(`{
        var buttons = Array.from(document.querySelectorAll('button.bg-super'));
        var buttonsWithSvgPath = buttons.filter(button => button.querySelector('svg path'));

        var button = buttonsWithSvgPath[buttonsWithSvgPath.length - 1];

        button.click();
		}
      `);
		} catch (e) {
			console.debug('Error in PerplexityLlama.handleSubmit():', e);
		}
	}

	static handleCss() {
		this.getWebview().addEventListener('dom-ready', () => {
			// hide message below text input, sidebar, suggestions on new chat
			try {
				setTimeout(() => {
					this.getWebview().executeJavaScript(`{
          // Add Dark Mode
          document.documentElement.classList.add('dark');
				}`);
				}, 100);
			} catch (e) {
				console.debug('Error in PerplexityLlama.handleCss():', e);
			}
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

module.exports = PerplexityLlama;
