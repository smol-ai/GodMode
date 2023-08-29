const Provider = require('./provider');

class OpenAI extends Provider {
	static webviewId = 'webviewOAI';
	static fullName = 'OpenAI ChatGPT';
	static shortName = 'ChatGPT';

	static url = 'https://chat.openai.com/?model=gpt-4-code-interpreter'; // TODO - let people switch

	static handleInput(input) {
		const fullName = this.fullName;
		this.getWebview().executeJavaScript(`{
        var inputElement = document.querySelector('textarea[placeholder*="Send a message"]');
        if (inputElement) {
          const inputEvent = new Event('input', { bubbles: true });
          inputElement.value = \`${input}\`; // must be escaped backticks to support multiline
          inputElement.dispatchEvent(inputEvent);
        }
      }`);
	}

	static handleSubmit() {
		this.getWebview().executeJavaScript(`{
        // var btn = document.querySelector("textarea[placeholder*='Send a message']+button"); // this one broke recently .. note that they add another div (for the file upload) in code interpreter mode
        var btn = document.querySelector("textarea[placeholder*='Send a message']").parentElement
        var btn = [...btn.querySelectorAll("button")].slice(-1)[0];
        if (btn) {
          btn.focus();
          btn.disabled = false;
          btn.click();
        }
    }
      `);
	}

	static handleCss() {
		this.getWebview().addEventListener('dom-ready', () => {
			// hide message below text input, sidebar, suggestions on new chat
			this.getWebview().insertCSS(`
        body {
          scrollbar-width: none;
        }
        .text-xs.text-center {
            opacity: 0;
            height: 0;
            margin-bottom: -10px;
          }

          [class*="shared__Wrapper"] {
            align-items: center;
            justify-content: center;
            text-align: center;
            margin-top: 15vh;
          }

          [class*="shared__Wrapper"] h3 {
            margin-top: -40px;
            font-size: 20px;
          }


        `);
		});
	}

	static isEnabled() {
		return window.electron.electronStore.get(`${this.webviewId}Enabled`, true);
	}
}

module.exports = OpenAI;
