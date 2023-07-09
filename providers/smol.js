const Store = require('electron-store');
const store = new Store();

const Provider = require('./provider');

class SmolTalk extends Provider {
	static webviewId = 'webviewSMOL';
  static fullName = 'Smol Talk';


	static url = 'https://smoltalk.vercel.app/';

	static handleInput(input) {
		this.getWebview().executeJavaScript(`
    function simulateUserInput(element, text) {
      const inputEvent = new Event('input', { bubbles: true });
      element.focus();
      element.value = text;
      element.dispatchEvent(inputEvent);
    }
    var inputElement = document.querySelector('#smol-inputbox')
    simulateUserInput(inputElement, "${input}");
	`)}

	static handleSubmit(input) {
		this.getWebview().executeJavaScript(`

    var inputElement = document.querySelector('#smol-inputbox')

    // try to send keyboard event to trigger the re-enable of the disabled button
    // thanks chatgpt!
    var event = new Event('input', { bubbles: true });
    event.simulated = true;
    var tracker = inputElement._valueTracker;
    if (tracker) {
      tracker.setValue("${input}");
    }
    inputElement.value = "${input}"
    inputElement.dispatchEvent(event);
    inputElement.value = "${input}"
    inputElement.dispatchEvent(event);

    var btn = document.querySelector('#smol-submitbtn');

    btn.setAttribute("aria-disabled", "false"); // doesnt work alone
    btn.disabled = false;
    btn.click()`);
	}

	static handleCss() {
		this.getWebview().addEventListener('dom-ready', () => {
			// // hide message below text input, sidebar, suggestions on new chat
			// setTimeout(() => {
			// 	this.getWebview().insertCSS(`
      //   header, .container {
      //     background-color: white;
      //     /* single line dark mode ftw */
      //     filter: invert(100%) hue-rotate(180deg);
      //   }
      //   /* hide the claude avatar in response */
      //   .p-1.w-9.h-9.shrink-0 {
      //     display: none;
      //   }
      //   /* reduce claude prompt margins */
      //   .mx-4.md\:mx-12.mb-2.md\:mb-4.mt-2.w-auto {
      //     margin: 0 !important;
      //   }
      //   `);
			// }, 1000);
		});
	}

	static isEnabled() {
		return store.get(`${this.webviewId}Enabled`, true);
	}
}

module.exports = SmolTalk;