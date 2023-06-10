const Store = require('electron-store');
const store = new Store();

class Provider {
	static setupCustomPasteBehavior() {
		this.webview.addEventListener('dom-ready', () => {
			this.webview.executeJavaScript(`
					document.addEventListener('paste', (event) => {
					event.preventDefault();
					let text = event.clipboardData.getData('text');
					let activeElement = document.activeElement;
					let start = activeElement.selectionStart;
					let end = activeElement.selectionEnd;
					activeElement.value = activeElement.value.slice(0, start) + text + activeElement.value.slice(end);
					activeElement.selectionStart = activeElement.selectionEnd = start + text.length;
					});
			`);
		});
	}

	static handleInput(input) {
		throw new Error(`Provider ${this.name} must implement handleInput()`);
	}

	static handleSubmit(input) {
		throw new Error(`Provider ${this.name} must implement handleSubmit()`);
	}

	static handleCss() {
		throw new Error(`Provider ${this.name} must implement handleCss()`);
	}

	static isEnabled() {
		throw new Error(`Provider ${this.name} must implement isEnabled()`);
	}
}


module.exports = Provider;