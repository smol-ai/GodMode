const Store = require('electron-store');
const store = new Store();

const Provider = require('./provider');

class Phind extends Provider {
	static webviewId = 'webviewPhind';
	static fullName = 'Phind';

	static url = 'https://www.phind.com/';

	static handleInput(input) {
		this.getWebview().executeJavaScript(`
        var inputElement = document.querySelector('textarea[placeholder*="Describe your technical task"]');

        function simulateUserInput(element, text) {
          var nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
          var event = new Event('input', { bubbles: true});

          nativeTextAreaValueSetter.call(inputElement, "${input}");
          inputElement.dispatchEvent(event);
        }

        simulateUserInput(inputElement, "${input}");
      `);
	}

	static handleSubmit() {
		this.getWebview().executeJavaScript(`
      // simulate keypress to trigger the submit button
      var keyEvent = new KeyboardEvent('keydown', {key: ' ', bubbles: true});
      inputElement.dispatchEvent(keyEvent);

      // add a space to the input value
      inputElement.value = inputElement.value + ' ';

      // simulate keyup event
      var keyupEvent = new KeyboardEvent('keyup', {key: ' ', bubbles: true});
      inputElement.dispatchEvent(keyupEvent);

      // click the submit button
      var buttonElement = document.querySelector('button[type="submit"]');
      buttonElement.click();
      `);
	}

	static handleCss() {
		this.getWebview().addEventListener('dom-ready', () => {
        setTimeout(() => {
        this.getWebview().executeJavaScript(`
        // Add Dark Mode
        const page = document.documentElement;
        page.setAttribute('data-theme', 'dark');
        page.setAttribute('style', 'color-scheme: dark;');

        // Hide Phind Logo
        const images = document.querySelectorAll('img[src*="phind"]');
        images[images.length - 1].setAttribute('style', 'display: none;');

        // Hide Tagline
        const tagline = document.querySelector('h1');
        tagline.setAttribute('style', 'display: none;');

        // Hide Explore Options
        const exploreOptions = document.querySelector('div.container:has(h4)');
        exploreOptions.setAttribute('style', 'display: none;');

        `);
      }, 100);
      });
	}

	static isEnabled() {
		return store.get(`${this.webviewId}Enabled`, false);
	}
}

module.exports = Phind;
