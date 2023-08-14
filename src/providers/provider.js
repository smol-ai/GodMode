// const { ipcRenderer } = require('electron');

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
					var text = event.clipboardData.getData('text');
					var activeElement = document.activeElement;

					// sometimes the active element needs  a "wake up" before paste (swyx: not entirely sure this works...)
					// Create a KeyboardEvent
					var event = new KeyboardEvent('keydown', {
						key: ' ',
						code: 'Space',
						which: 32,
						keyCode: 32,
						bubbles: true
					});

					// Dispatch the event to the active element
					activeElement.dispatchEvent(event);

					var start = activeElement.selectionStart;
					var end = activeElement.selectionEnd;
					activeElement.value = activeElement.value.slice(0, start) + text + activeElement.value.slice(end);
					activeElement.selectionStart = activeElement.selectionEnd = start + text.length;
					});
			`);
		});
	}

	static handleInput(input) {
		throw new Error(`Provider ${this.name} must implement handleInput()`);
	}

	static handleSubmit() {
		throw new Error(`Provider ${this.name} must implement handleSubmit()`);
	}

	static handleCss() {
		throw new Error(`Provider ${this.name} must implement handleCss()`);
	}

	// Some providers will have their own dark mode implementation
	static handleDarkMode(isDarkMode) {
		// Implement dark or light mode using prodiver-specific code
		if (isDarkMode) {
			this.getWebview().executeJavaScript(`
				document.documentElement.classList.add('dark');
				document.documentElement.classList.remove('light');
			`);
		} else {
			this.getWebview().executeJavaScript(`
				document.documentElement.classList.add('light');
				document.documentElement.classList.remove('dark');
			`);
		}
	}

	static getUserAgent() {
		return false;
	}

	static isEnabled() {
		return window.electron.electronStore.get(`${this.webviewId}Enabled`);
	}

	static setEnabled(state) {
		window.electron.electronStore.set(`${this.webviewId}Enabled`, state);
	}
}

module.exports = Provider;
