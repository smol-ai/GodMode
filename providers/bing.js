const Store = require('electron-store');
const store = new Store();

const Provider = require('./provider');

class Bing extends Provider {
	static webviewId = 'webviewBING';
	static fullName = 'Microsoft Bing';

	static url = 'https://bing.com/chat';

	static handleInput(input) {
		this.getWebview().executeJavaScript(`
			// Simulate user input
			function simulateUserInput(element, text) {
				const inputEvent = new Event('input', { bubbles: true });
				element.focus();
				element.value = text;
				element.dispatchEvent(inputEvent);
			}

			// SERP Shadow DOM
			var serpDOM = document.querySelector('.cib-serp-main');

			// Action Bar Shadow DOM
			var inputDOM = serpDOM.shadowRoot.querySelector('#cib-action-bar-main');

			// Text Input Shadow DOM
			var textInputDOM = inputDOM.shadowRoot.querySelector('cib-text-input');

			// This inner cib-text-input Shadow DOM is not always present
			var inputElement = textInputDOM ? textInputDOM.shadowRoot.querySelector('#searchbox') : inputDOM.shadowRoot.querySelector('#searchbox');

			simulateUserInput(inputElement, "${input}");
		`);
	}

	static handleSubmit(input) {
		this.getWebview().executeJavaScript(`
		// Access SERP Shadow DOM
		var serpDOM = document.querySelector('.cib-serp-main');

		// Inner Input Shadow DOM
		var inputDOM = serpDOM.shadowRoot.querySelector('#cib-action-bar-main');

		// Submit Button
		var submitButton = inputDOM.shadowRoot.querySelector('div.submit button.primary');
		submitButton.click();

		submitButton.focus();
		setTimeout(() => {
			submitButton.click();
		}, 100)
		`);
	}

	static getUserAgent() {
		return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.37'
	}

	/**
	 * Bing has a lot of nested shadow DOMs, so we have to use JS to access the
	 * elements we want to hide / style.
	 *
	 * FIXME: Still can't seem to get this working yet. There might be some funny
	 * scripts running in the background that are resetting styles.
	 *
	 * Thankfully, the event listeners are still working for input and submit, so
	 * we can still send prompts to the chatbot.
	 */
	static handleCss() {
    // this.webview.executeJavaScript(`
		// 		// Hide Header Bar
		// 		var headerBar = document.querySelector('header');
		// 		headerBar.remove();

    //     // // Access SERP Shadow DOM
    //     // var serpDOM = document.querySelector('.cib-serp-main').shadowRoot;

    //     // // Conversation Shadow DOM
    //     // var conversationDOM = serpDOM.querySelector('#cib-conversation-main').shadowRoot;

    //     // // Welcome Container Shadow DOM
    //     // var welcomeDOM = conversationDOM.querySelector('cib-welcome-container').shadowRoot;
		// 		// console.log('welcomeDOM', welcomeDOM);

    //     // // Hide all welcome container items except tone selector
    //     // welcomeDOM.querySelector('div.container-logo').setAttribute('style', 'display: none !important');
    //     // welcomeDOM.querySelector('div.container-title').setAttribute('style', 'display: none !important');
    //     // welcomeDOM.querySelector('div.container-subTitle').setAttribute('style', 'display: none !important');
    //     // welcomeDOM.querySelector('div.container-item').setAttribute('style', 'display: none !important');
    //     // welcomeDOM.querySelector('div.learn-tog-item').setAttribute('style', 'display: none !important');
    //     // welcomeDOM.querySelector('div.privacy-statement').setAttribute('style', 'display: none !important');
    // }`);
		this.getWebview().addEventListener('dom-ready', () => {
			// hide message below text input, sidebar, suggestions on new chat
			setTimeout(() => {
				this.getWebview().insertCSS(`
				#b_sydBgCover {
					background: black !important;
				}
        `);
			}, 1000);
		});
	}

	static isEnabled() {
		return store.get(`${this.webviewId}Enabled`, true);
	}
}

module.exports = Bing;