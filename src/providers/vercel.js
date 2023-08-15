const Provider = require('./provider');

class Vercel extends Provider {
	static webviewId = 'webviewVercelAI';
	static fullName = 'Vercel AI Chatbot';

	static url = 'https://chat.vercel.ai/';

	static handleInput(input) {
		this.getWebview().executeJavaScript(`{
        var inputElement = document.querySelector('textarea[placeholder*="Send a message."]'); // can be "Ask anything" or "Ask follow-up"
        var nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
        nativeTextAreaValueSetter.call(inputElement, \`${input}\`);

        var event = new Event('input', { bubbles: true});
        inputElement.dispatchEvent(event);
    }`);
	}

	static handleSubmit() {
		this.getWebview().executeJavaScript(`{
    var buttons = Array.from(document.querySelectorAll('button[type="submit"]'));
    var buttonsWithSrOnly = buttons.filter(button => {
      var span = button.querySelector('span');
      return span && span.textContent.trim() === 'Send message';
    });

    if (buttonsWithSrOnly.length == 1){
      var button = buttonsWithSrOnly[0];
      button.click();
    }
  }`);
	}
	static handleCss() {
		this.getWebview().addEventListener('dom-ready', () => {
			// Hide the "Try asking" segment
			setTimeout(() => {
				this.getWebview().insertCSS(`
        .mt-lg {
          display: none;
        }
		    `);
			}, 100);
		});
	}

	static isEnabled() {
		return window.electron.electronStore.get(`${this.webviewId}Enabled`, true);
	}
}

module.exports = Vercel;
