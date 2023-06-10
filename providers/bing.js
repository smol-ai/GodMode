const Store = require('electron-store');
const store = new Store();

const Provider = require('./provider');

class Bing extends Provider {
	static webviewId = 'webviewBING';
	static webview = document.getElementById('webviewBING');

	static url = 'https://bing.com/chat';

	static handleInput(input) {
		this.webview.executeJavaScript(`
			// Simulate user input
			function simulateUserInput(element, text) {
				const inputEvent = new Event('input', { bubbles: true });
				element.focus();
				element.value = text;
				element.dispatchEvent(inputEvent);
			}

			// Access SERP Shadow DOM
			var serpDOM = document.querySelector('.cib-serp-main');

			// Inner Input Shadow DOM
			var inputDOM = serpDOM.shadowRoot.querySelector('#cib-action-bar-main');

			// Input Element
			var inputElement = inputDOM.shadowRoot.querySelector('#searchbox');
			simulateUserInput(inputElement, "${input}");
		`);
	}

	static handleSubmit(input) {
		this.webview.executeJavaScript(`
		// Access SERP Shadow DOM
		var serpDOM = document.querySelector('.cib-serp-main');

		// Inner Input Shadow DOM
		var inputDOM = serpDOM.shadowRoot.querySelector('#cib-action-bar-main');

		// Submit Button
		var submitButton = inputDOM.shadowRoot.querySelector('div.submit button.primary');
		submitButton.click();
		`);
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
    // setTimeout(function() {
		// 		// Hide Header Bar
		// 		var headerBar = document.querySelector('header');
		// 		headerBar.setAttribute('style', 'display: none !important');
		// 		console.log('headerBar', headerBar);

    //     // Access SERP Shadow DOM
    //     var serpDOM = document.querySelector('.cib-serp-main').shadowRoot;

    //     // Conversation Shadow DOM
    //     var conversationDOM = serpDOM.querySelector('#cib-conversation-main').shadowRoot;

    //     // Welcome Container Shadow DOM
    //     var welcomeDOM = conversationDOM.querySelector('cib-welcome-container').shadowRoot;
		// 		console.log('welcomeDOM', welcomeDOM);

    //     // Hide all welcome container items except tone selector
    //     welcomeDOM.querySelector('div.container-logo').setAttribute('style', 'display: none !important');
    //     welcomeDOM.querySelector('div.container-title').setAttribute('style', 'display: none !important');
    //     welcomeDOM.querySelector('div.container-subTitle').setAttribute('style', 'display: none !important');
    //     welcomeDOM.querySelector('div.container-item').setAttribute('style', 'display: none !important');
    //     welcomeDOM.querySelector('div.learn-tog-item').setAttribute('style', 'display: none !important');
    //     welcomeDOM.querySelector('div.privacy-statement').setAttribute('style', 'display: none !important');
    // }, 10000); // 10000 milliseconds = 10 seconds (after elements have definitely loaded)
    // `);
	}

	static isEnabled() {
		return store.get(`${this.webviewId}Enabled`, true);
	}
}

module.exports = Bing;