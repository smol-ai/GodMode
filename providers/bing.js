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

	static handleSubmit() {
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

	/** Bing requires MS Edge user agent. */
	static getUserAgent() {
		return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.37';
	}

	static handleCss() {
		this.getWebview().addEventListener('dom-ready', () => {
			// hide message below text input, sidebar, suggestions on new chat
			setTimeout(() => {
				// .b_sydConvMode::after {
				this.getWebview().insertCSS(`
				html, body {
					overflow: hidden;
					scrollbar-width: none;
				}
				body {
					background-color: #1d1d1d !important;
					color: #d7d7d7 !important;
				}
				#b_sydBgCover {
					background: black !important;
				}
				header {
					display: none !important;
				}
				#b_sydWelcomeTemplate {
					display: none !important;
				}
				.preview-container {
					display: none !important;
				}
        `);
			}, 1000);
			setTimeout(() => {
				this.getWebview().executeJavaScript(`
					// Access SERP Shadow DOM
					var serpDOM = document.querySelector('.cib-serp-main').shadowRoot;

					// Conversation Shadow DOM
					var conversationDOM = serpDOM.querySelector('#cib-conversation-main').shadowRoot;

					// Action Bar Shadow DOM
					var actionBarDOM = serpDOM.querySelector('#cib-action-bar-main').shadowRoot;

					// Text Input Shadow DOM
					var textInputDOM = actionBarDOM.querySelector('cib-text-input').shadowRoot;

					// Welcome Container Shadow DOM
					var welcomeDOM = conversationDOM.querySelector('cib-welcome-container').shadowRoot;

					// Hide all welcome container items except tone selector
					// welcomeDOM.querySelector('div.preview-container').setAttribute('style', 'display: none !important;');

					// Hide all welcome container items except tone selector
					welcomeDOM.querySelector('div.container-logo').setAttribute('style', 'display: none !important');
					welcomeDOM.querySelector('div.container-title').setAttribute('style', 'color: white !important');
					welcomeDOM.querySelector('div.container-subTitle').setAttribute('style', 'display: none !important');
					welcomeDOM.querySelector('div.container-item').setAttribute('style', 'display: none !important');
					welcomeDOM.querySelector('div.learn-tag-item').setAttribute('style', 'display: none !important');
					welcomeDOM.querySelector('div.privacy-statement').setAttribute('style', 'display: none !important');

					// Remove feedback widget
					serpDOM.querySelector('cib-serp-feedback').setAttribute('style', 'display: none !important');

					// Remove background gradients
					serpDOM.querySelector('cib-background').remove();
					conversationDOM.querySelector('.fade.top').remove();
					conversationDOM.querySelector('.fade.bottom').remove();

					// Recolor text input
					textInputDOM.querySelector('textarea').setAttribute('style', 'background-color: #1d1d1d !important; color: #d7d7d7 !important;');
					actionBarDOM.querySelector('.main-container.body-2').setAttribute('style', 'background-color: #1d1d1d !important; color: #d7d7d7 !important;');

				`);
			}, 1000);
		});
	}

	static isEnabled() {
		return store.get(`${this.webviewId}Enabled`, true);
	}
}

module.exports = Bing;
