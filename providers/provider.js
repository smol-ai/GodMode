const Store = require('electron-store');
const store = new Store();
const log = require('electron-log');

class Provider {

	static webviewId = '';

	static getWebview() {
		return document.getElementById(this.webviewId);
	}
	static paneId() {
		return `${this.name.toLowerCase()}Pane`;
	}

	static setupCustomPasteBehavior() {
		this.getWebview().addEventListener('dom-ready', () => {
			this.getWebview().executeJavaScript(`
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

	static getUserAgent() {
		return false;
	}

	static isEnabled() {
		return store.get(`${this.webviewId}Enabled`);
	}

	static setEnabled(state) {
		store.set(`${this.webviewId}Enabled`, state);
	}

}


module.exports = Provider;