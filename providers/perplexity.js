const Store = require('electron-store');
const store = new Store();

const Provider = require('./provider');

class Perplexity extends Provider {
	static webviewId = 'webviewPerplexity';
	static fullName = 'Perplexity';

	static url = 'https://www.perplexity.ai/';

	static handleInput(input) {
		this.getWebview().executeJavaScript(`
        // function simulateUserInput(element, text) {
        //   const inputEvent = new Event('input', { bubbles: true });
        //   element.focus();
        //   element.value = text;
        //   element.dispatchEvent(inputEvent);
        // }
        var inputElement = document.querySelector('textarea[placeholder*="Ask"]'); // can be "Ask anything" or "Ask follow-up"
        // inputElement.focus(); inputElement.click();
        // simulateUserInput(inputElement, "${input}");
        var nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
        nativeTextAreaValueSetter.call(inputElement, "${input}");

        var event = new Event('input', { bubbles: true});
        inputElement.dispatchEvent(event);
      `);
	}

	static handleSubmit() {
		this.getWebview().executeJavaScript(`
        var inputElement = document.querySelector('textarea[placeholder*="Ask anything"]');
        // var btn = document.querySelector('button.bg-super.aspect-square');
        // btn.click();
        // const event = new KeyboardEvent('keyup', {
        //   key: 'Enter',
        //   metaKey: true
        // });
        // inputElement.dispatchEvent(event);
        var buttons = Array.from(document.querySelectorAll('button'));
        var buttonsWithSvgPath = buttons.filter(button => button.querySelector('svg path'));

        var button = buttonsWithSvgPath[buttonsWithSvgPath.length - 1];

        button.click();

      `);
	}

	static handleCss() {
		this.getWebview().addEventListener('dom-ready', () => {
			// hide message below text input, sidebar, suggestions on new chat
			setTimeout(() => {
				this.getWebview().executeJavaScript(`
          // Add Dark Mode
          document.documentElement.classList.add('dark');

          `);
			}, 100);
		});
	}

	static isEnabled() {
		return store.get(`${this.webviewId}Enabled`, false);
	}
}

module.exports = Perplexity;
