const Provider = require('./provider');

class Phind extends Provider {
	static webviewId = 'webviewPhind';
	static fullName = 'Phind (Buggy)';
	static shortName = 'Phind';

	static url = 'https://www.phind.com/';

	static handleInput(input) {
		const fullName = this.fullName;
		this.getWebview().executeJavaScript(`{
        var inputElement = document.querySelector('textarea[placeholder*="Describe your task in detail. What are you stuck on"]');
        if (!inputElement) {
            inputElement = document.querySelector('textarea[placeholder*="Send message"]');
        }
        if (inputElement) {
          var nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
          var event = new Event('input', { bubbles: true});

          nativeTextAreaValueSetter.call(inputElement, \`${input}\`);
          inputElement.dispatchEvent(event);
        }

      }`);
	}

	static handleSubmit(superprompt) {
    // url encode superprompt and navigate webview
    const encodedSuperprompt = encodeURIComponent(superprompt);
    this.getWebview().loadURL(`https://www.phind.com/search?q=${encodedSuperprompt}&source=searchbox`);


    // doesnt work
		// this.getWebview().executeJavaScript(`{
    //   var button = document.querySelector('button[type="submit"]');
    //   button.click();
    //   }`);
	}

	static handleCss() {
    this.getWebview().addEventListener('dom-ready', () => {
      // briefly commented out in order to get Phind to work - swyx
			// setTimeout(() => {
			// 	this.getWebview().executeJavaScript(`{
      //   // Hide Phind Logo
      //   const images = document.querySelectorAll('img[src*="phind"]');
      //   if (images) images[images.length - 1].setAttribute('style', 'display: none;');

      //   // Hide Tagline
      //   const tagline = document.querySelector('h1');
      //   if (tagline) tagline.setAttribute('style', 'display: none;');

      //   // Hide Explore Options
      //   const exploreOptions = document.querySelector('div.container:has(h4)');
      //   if (exploreOptions) exploreOptions.setAttribute('style', 'display: none;');
      //   }`);
			// }, 100);
		});
	}

	// Some providers will have their own dark mode implementation
	static handleDarkMode(isDarkMode) {
    // briefly commented out in order to get Phind to work - swyx
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
