const Provider = require('./provider');

class Bard extends Provider {
	static webviewId = 'webviewBARD';
	static fullName = 'Google Bard';
	static shortName = 'Bard';

	static url = 'https://bard.google.com';

	static handleInput(input) {
		const fullName = this.fullName;
		this.getWebview().executeJavaScript(`{
      var inputElement = document.querySelector("#mat-input-0");
      if (!inputElement) {
        console.error('inputElement for ${fullName} doesnt exist, have you logged in or are you on the right page?')
      } else {
        const inputEvent = new Event('input', { bubbles: true });
        inputElement.value = \`${input}\`; // must be escaped backticks to support multiline
        inputElement.dispatchEvent(inputEvent);
      }
    }
      `);
	}

	static handleSubmit() {
		this.getWebview().executeJavaScript(`{
        var btn = document.querySelector("button[aria-label*='Send message']");
        btn.setAttribute("aria-disabled", "false"); // doesnt work alone
        btn.focus();
        btn.click()
    }`);
	}

	static handleCss() {
		this.getWebview().addEventListener('dom-ready', () => {
			// hide message below text input, sidebar, suggestions on new chat
			this.getWebview().insertCSS(`
          .chat-history, .conversation-container, .input-area, .mdc-text-area {
            margin: 0 !important;
          }
          /* hide the bard greeting */
          response-container {
                display: none;
          }
          model-response response-container {
                display: block !important;
          }
          /* hide header and footer */
          .gmat-caption {
            opacity: 0;
            height: 0;
          }
          header {
            display: none !important;
          }
          header + div {
            display: none !important;
          }
          .capabilities-disclaimer {
            display: none !important;
          }
          .input-area-container .input-area {
            padding: 0;
          }
          /* hide the bard avatar in response */
          .logo-gutter {
            display: none !important;
          }
        `);
		});
	}

	static handleDarkMode(isDarkMode) {
		// Toggle the dark mode setting in the store
		window.electron.electronStore.set('isDarkMode', isDarkMode);

		if (isDarkMode) {
			this.getWebview().executeJavaScript(`{
        document.querySelector('body').classList.add('dark-theme');
        document.querySelector('body').classList.remove('light-theme');
      }`);
		} else {
			this.getWebview().executeJavaScript(`{
        document.querySelector('body').classList.add('light-theme');
        document.querySelector('body').classList.remove('dark-theme');
      }`);
		}
	}

	static isEnabled() {
		return window.electron.electronStore.get(`${this.webviewId}Enabled`, true);
	}
}

module.exports = Bard;
