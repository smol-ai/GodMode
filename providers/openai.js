const Store = require('electron-store');
const store = new Store();

const Provider = require('./provider');

class OpenAi extends Provider {
	static webviewId = 'webviewOAI';
	static fullName = 'OpenAI ChatGPT';

	static url = 'https://chat.openai.com/?model=gpt-4-code-interpreter'; // TODO - let people switch

	static handleInput(input) {
		this.getWebview().executeJavaScript(`
        function simulateUserInput(element, text) {
          const inputEvent = new Event('input', { bubbles: true });
          element.focus();
          element.value = text;
          element.dispatchEvent(inputEvent);
        }
        var inputElement = document.querySelector('textarea[placeholder*="Send a message"]');
        simulateUserInput(inputElement, "${input}");
      `);
	}

	static handleSubmit() {
		this.getWebview().executeJavaScript(`
        // var btn = document.querySelector("textarea[placeholder*='Send a message']+button"); // this one broke recently .. note that they add another div (for the file upload) in code interpreter mode
        var btn = document.querySelector("textarea[placeholder*='Send a message']").parentElement
        // console.log('btn', btn)
        var btn = [...btn.querySelectorAll("button")].slice(-1)[0];
        // console.log('btn', btn)
        btn.focus();
        btn.disabled = false;
        btn.click();
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
        setTimeout(() => {
          this.getWebview().executeJavaScript(`
          // Get the root element
          const root = document.querySelector(':root');

          // Set the color-scheme CSS variable
          root.style.setProperty('--color-scheme', 'dark');

          // Add the .dark class to the body
          document.body.classList.add('dark');

          `);
        }, 0);
		});
	}

	static isEnabled() {
		return store.get(`${this.webviewId}Enabled`, true);
	}
}

module.exports = OpenAi;
