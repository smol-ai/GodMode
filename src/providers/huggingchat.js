const Provider = require('./provider');

class HuggingChat extends Provider {
	static webviewId = 'webviewHuggingChat';
	static fullName = 'HuggingChat (Llama2, OpenAssistant)';
	static shortName = 'HuggingChat';

	static url = 'https://huggingface.co/chat/';

	static handleInput(input) {
		this.getWebview().executeJavaScript(`
        var inputElement = document.querySelector('textarea[placeholder*="Ask anything"]');
        if (!inputElement) {
          console.error('inputElement for ${fullName} doesnt exist, have you logged in or are you on the right page?')
          return // not logged in yet;
        }
        const inputEvent = new Event('input', { bubbles: true });
        inputElement.value = \`${input}\`; // must be escaped backticks to support multiline
        inputElement.dispatchEvent(inputEvent);
      `);
	}

	static handleSubmit() {
		this.getWebview().executeJavaScript(`
        var btn = document.querySelector('form.relative > div > button[type="submit"]');
        btn.click();
      `);
	}

	static handleCss() {
		this.getWebview().addEventListener('dom-ready', () => {
			// hide message below text input, sidebar, suggestions on new chat
			setTimeout(() => {
				this.getWebview().executeJavaScript(`
          // Hide Examples Box
          var elements = Array.from(document.querySelectorAll('div[class]'));
          var targetElement;

          for (var i = 0; i < elements.length; i++) {
              var classes = elements[i].className.split(' ');
              if (classes.includes('lg:col-span-3') && classes.includes('lg:mt-12') && elements[i].textContent.includes('Examples')) {
                  targetElement = elements[i];
                  break;
              }
          }

          if (targetElement) {
            targetElement.style.display = 'none';
          }

          // Hide HuggingChat Logo
          var elements = Array.from(document.querySelectorAll('div object'));

          elements.forEach(element => {
            if (element.parentElement.textContent.includes('HuggingChat')) {
              element.parentElement.parentElement.style.display = 'none';
            }
          });

          // Same loop for the other text.
          var pElements = Array.from(document.querySelectorAll('p'));

          pElements.forEach(element => {
            if (element.textContent.includes('Examples')) {
              element.parentElement.style.display = 'none';
            }
          });


          `);
			}, 100);
		});
	}

	static isEnabled() {
		return window.electron.electronStore.get(`${this.webviewId}Enabled`, false);
	}
}

module.exports = HuggingChat;
