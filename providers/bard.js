const Store = require('electron-store');
const store = new Store();

const Provider = require('./provider');

class Bard extends Provider {
	static webviewId = 'webviewBARD';
  static fullName = 'Google Bard';

	static url = 'https://bard.google.com';

	static handleInput(input) {
		this.getWebview().executeJavaScript(`
      var inputElement = document.querySelector("#mat-input-0");

      // try to send keyboard event to trigger the re-enable of the disabled button
      // thanks chatgpt!
      var event = new Event('input', { bubbles: true });
      event.simulated = true;
      var tracker = inputElement._valueTracker;
      if (tracker) {
        tracker.setValue("${input}");
      }
      // Dispatch the event after a short delay to fix the button state
      setTimeout(function() {
        inputElement.dispatchEvent(event);
      }, 100);
      inputElement.value = "${input}"`);
	}

	static handleSubmit(input) {
		this.getWebview().executeJavaScript(`
        var inputElement = document.querySelector("#mat-input-0");

        // try to send keyboard event to trigger the re-enable of the disabled button
        // thanks chatgpt!
        var event = new Event('input', { bubbles: true });
        event.simulated = true;
        var tracker = inputElement._valueTracker;
        if (tracker) {
          tracker.setValue("${input}");
        }
        inputElement.dispatchEvent(event);
        inputElement.value = "${input}"
        var btn = document.querySelector("button[aria-label*='Send message']");
        btn.setAttribute("aria-disabled", "false"); // doesnt work alone
        btn.click()
      `);
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

	static isEnabled() {
		return store.get(`${this.webviewId}Enabled`, false);
	}
}

module.exports = Bard;