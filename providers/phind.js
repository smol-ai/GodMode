const Store = require('electron-store');
const store = new Store();

const Provider = require('./provider');

class Phind extends Provider {
	static webviewId = 'webviewPhind';
	static fullName = 'Phind';

	static url = 'https://www.phind.com/';

	static handleInput(input) {
		this.getWebview().executeJavaScript(`
        function simulateUserInput(element, text) {
          const inputEvent = new Event('input', { bubbles: true });
          element.focus();
          element.value = text;
          element.dispatchEvent(inputEvent);
        }
        var inputElement = document.querySelector('textarea[placeholder*="Describe your technical task"]');
        simulateUserInput(inputElement, "${input}");
      `);
	}

	static handleSubmit() {
		this.getWebview().executeJavaScript(`
      // focus the input element
      var inputElement = document.querySelector('textarea[placeholder*="Describe your technical task"]');
      inputElement.focus();

      // simulate keypress to trigger the submit button
      var keyEvent = new KeyboardEvent('keydown', {key: ' ', bubbles: true});
      inputElement.dispatchEvent(keyEvent);

      // add a space to the input value
      inputElement.value = inputElement.value + ' ';

      // simulate keyup event
      var keyupEvent = new KeyboardEvent('keyup', {key: ' ', bubbles: true});
      inputElement.dispatchEvent(keyupEvent);

      // click the submit button
      var buttonElement = document.querySelector('button[type="submit"]');
      buttonElement.click();
      `);
	}

	static handleCss() {
		this.getWebview().addEventListener('dom-ready', () => {
			// hide message below text input, sidebar, suggestions on new chat
        setTimeout(() => {
          this.getWebview().executeJavaScript(`
          // Add Dark Mode
          document.documentElement.classList.add('dark');

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

          // Hide Phind Logo
          var elements = Array.from(document.querySelectorAll('div object'));

          elements.forEach(element => {
            if (element.parentElement.textContent.includes('Phind')) {
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
		return store.get(`${this.webviewId}Enabled`, false);
	}
}

module.exports = Phind;
