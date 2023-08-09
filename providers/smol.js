const Store = require('electron-store');
const store = new Store();

const Provider = require('./provider');

class SmolTalk extends Provider {
	static webviewId = 'webviewSMOL';
	static fullName = 'Smol Talk (WIP)';

	static url = 'https://smoltalk.vercel.app/';

	static handleInput(input) {
		this.getWebview().executeJavaScript(`
		var inputElement = document.querySelector('#smol-inputbox')
		function simulateUserInput(element, text) {
			var nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
			var event = new Event('input', { bubbles: true});

			nativeTextAreaValueSetter.call(inputElement, text);
			inputElement.dispatchEvent(event);
		}

		simulateUserInput(inputElement, "${input}");
	`);
	}

	static clearCookies() {
		this.getWebview().executeJavaScript(`
      const cookies = document.cookie.split(";");
  
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i];
          const eqPos = cookie.indexOf("=");
          const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
      `);
	}

	static handleSubmit() {
		this.getWebview().executeJavaScript(`

    var btn = document.querySelector('#smol-submitbtn');

    btn.focus();
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
