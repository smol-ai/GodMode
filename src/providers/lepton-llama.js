const Provider = require('./provider');

class LeptonLlama extends Provider {
	static webviewId = 'webiewLeptonLlama';
	static fullName = 'Llama 2 (via Lepton)';
	static shortName = 'Llama2-Lepton';

	static url = 'https://llama2.lepton.run/';

	static handleInput(input) {
		try {
			this.getWebview().executeJavaScript(`{
        var inputElement = document.querySelector('textarea[placeholder*="Send a message"]');
        if (inputElement) {
					var nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
					nativeTextAreaValueSetter.call(inputElement, \`${input}\`);
					var event = new Event('input', { bubbles: true});
					inputElement.dispatchEvent(event);
        }
		}`);
		} catch (e) {
			console.debug('Error in LeptonLlama.handleInput():', e);
		}
	}

	static codeForInputElement = `var inputElement = document.querySelector('textarea[placeholder*="Ask"]');`;
	static codeForSetInputElementValue(prompt) {
		return `
		var nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
		nativeTextAreaValueSetter.call(inputElement, \`${prompt}\`);
		var event = new Event('input', { bubbles: true});
		inputElement.dispatchEvent(event);
		`;
	}
	static codeForClickingSubmit = `
		var buttons = Array.from(document.querySelectorAll('button.ant-btn-primary'));
		var buttonsWithSvgPath = buttons.filter(button => button.querySelector('svg path'));

		var button = buttonsWithSvgPath[buttonsWithSvgPath.length - 1];

		button.click();
	`;
	static codeForExtractingResponse = `[...document.querySelectorAll('.ant-space.ant-space-horizontal .ant-typography pre')].slice(-1)[0]`; // dont append semicolon, we will append innerhtml etc

	static handleSubmit() {
		try {
			this.getWebview().executeJavaScript(`{
        var buttons = Array.from(document.querySelectorAll('button.ant-btn-primary'));
				if (buttons[0]) {
					var buttonsWithSvgPath = buttons.filter(button => button.querySelector('svg path'));

					var button = buttonsWithSvgPath[buttonsWithSvgPath.length - 1];

					button.click();
				}
		}
      `);
		} catch (e) {
			console.debug('Error in LeptonLlama.handleSubmit():', e);
		}
	}

	static handleCss() {
		this.getWebview().addEventListener('dom-ready', () => {
			// hide message below text input, sidebar, suggestions on new chat
			// try {
			// 	// setTimeout(() => {
			// 	// 	this.getWebview().executeJavaScript(`{
			// 	//   // Add Dark Mode
			// 	//   document.documentElement.classList.add('dark');
			// 	// }`);
			// 	// }, 100);
			// 	setTimeout(() => {
			// 		this.getWebview().executeJavaScript(`{
			// 		// Dispatch the change event manually if there are any event listeners
			// 		var event = new Event('change');
			// 		selectElement.dispatchEvent(event);
			// 	}`);
			// 	}, 1000);
			// } catch (e) {
			// 	console.debug('Error in LeptonLlama.handleCss():', e);
			// }
			setTimeout(() => {
				// hide temperature/length settings
				this.getWebview().insertCSS(`
        div.ant-col.ant-col-24.css-11zb6yo.ant-col-sm-24.ant-col-md-7.ant-col-xl-5.ant-col-xxl-4.css-lqewvt {
          display: none;
        }
		    `);
			}, 100);
		});
	}

	static isEnabled() {
		return window.electron.electronStore.get(`${this.webviewId}Enabled`, false);
	}
}

module.exports = LeptonLlama;
