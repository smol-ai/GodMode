const Provider = require('./provider');

class Phind extends Provider {
	static webviewId = 'webviewPhind';
	static fullName = 'Phind';

	static url = 'https://www.phind.com/';

	static handleInput(input) {
		this.getWebview().executeJavaScript(`{
        var inputElement = document.querySelector('textarea[placeholder*="Describe your task in detail. What are you stuck on"]');
        if (!inputElement) {
            inputElement = document.querySelector('textarea[placeholder*="Send message"]');
        }

        var nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
        var event = new Event('input', { bubbles: true});

        nativeTextAreaValueSetter.call(inputElement, \`${input}\`);
        inputElement.dispatchEvent(event);
      }`);
	}

	static handleSubmit() {
		this.getWebview().executeJavaScript(`{
      var inputElement = document.querySelector('textarea[placeholder*="Describe your task in detail. What are you stuck on"]');
      if (!inputElement) {
          inputElement = document.querySelector('textarea[placeholder*="Send message"]');
      }

      // simulate keypress to trigger the submit button
      var keyEvent = new KeyboardEvent('keydown', {key: ' ', bubbles: true});
      inputElement.dispatchEvent(keyEvent);

      // add a space to the input value
      inputElement.value = inputElement.value + ' ';

      // simulate keyup event
      var keyupEvent = new KeyboardEvent('keyup', {key: ' ', bubbles: true});
      inputElement.dispatchEvent(keyupEvent);

      function findParentButton() {
        let buttons = document.querySelectorAll('button[type="submit"]');
        for(let button of buttons) {
          let childIcon = button.querySelector('i.fe.fe-arrow-right');
          if(childIcon) {
            return button;
          }
        }
        return null;
      }

      var buttonElement = findParentButton();
      buttonElement.click();
      }`);
	}

	static handleCss() {
		this.getWebview().addEventListener('dom-ready', () => {
			setTimeout(() => {
				this.getWebview().executeJavaScript(`{
        // Hide Phind Logo
        const images = document.querySelectorAll('img[src*="phind"]');
        if (images) images[images.length - 1].setAttribute('style', 'display: none;');

        // Hide Tagline
        const tagline = document.querySelector('h1');
        if (tagline) tagline.setAttribute('style', 'display: none;');

        // Hide Explore Options
        const exploreOptions = document.querySelector('div.container:has(h4)');
        if (exploreOptions) exploreOptions.setAttribute('style', 'display: none;');
        }`);
			}, 100);
		});
	}

	// Some providers will have their own dark mode implementation
	static handleDarkMode(isDarkMode) {
		// Implement dark or light mode using prodiver-specific code
		if (isDarkMode) {
			this.getWebview().executeJavaScript(`{
        document.documentElement.setAttribute('data-theme', 'dark');
      }`);
		} else {
			this.getWebview().executeJavaScript(`{
        document.documentElement.setAttribute('data-theme', 'light');
      }`);
		}
	}

	static isEnabled() {
		return window.electron.electronStore.get(`${this.webviewId}Enabled`, false);
	}
}

module.exports = Phind;
