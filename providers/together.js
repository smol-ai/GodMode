const Store = require('electron-store');
const store = new Store();

const Provider = require('./provider');

class Together extends Provider {
	static webviewId = 'webviewTOGETHER';
  static fullName = 'Together (WIP - RedPajama, StarCoder, Falcon, etc)';


	static url = 'https://api.together.xyz/playground/chat';

	static handleInput(input) {
		this.getWebview().executeJavaScript(`
    var inputElement = document.querySelector('form textarea[placeholder*="Enter text here"]');
    inputElement.focus();
    inputElement.value = "${input}";
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
    `);
	}

	static handleSubmit() {
		this.getWebview().executeJavaScript(`
    var btn = document.querySelector('form button:has(svg)'); // YES we are using the has selector!!!!
    btn.focus();
    btn.disabled = false;
    btn.click()`);
	}

	static handleCss() {
		// this.getWebview().addEventListener('dom-ready', () => {
		// 	// hide message below text input, sidebar, suggestions on new chat
		// 	setTimeout(() => {
		// 		this.getWebview().insertCSS(`
    //     header, .container {
    //       background-color: white;
    //       /* single line dark mode ftw */
    //       filter: invert(100%) hue-rotate(180deg);
    //     }
    //     /* hide the claude avatar in response */
    //     .p-1.w-9.h-9.shrink-0 {
    //       display: none;
    //     }
    //     /* reduce claude prompt margins */
    //     .mx-4.md\:mx-12.mb-2.md\:mb-4.mt-2.w-auto {
    //       margin: 0 !important;
    //     }
    //     `);
		// 	}, 1000);
		// });
	}

	static isEnabled() {
		return store.get(`${this.webviewId}Enabled`, false);
	}
}

module.exports = Together;