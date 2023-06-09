console.log('interface.js loaded');
const Store = require('electron-store');
const store = new Store();

/* ========================================================================== */
/* Provider-Specific Handlers                                                 */
/* ========================================================================== */

/* Shared Handlers ---------------------------------------------------------- */

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
			}
		);
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

/* OpenAI ChatGPT ----------------------------------------------------------- */

class OpenAi extends Provider {
	static webviewId = 'webviewOAI';
	static webview = document.getElementById('webviewOAI');

	static url = 'https://chat.openai.com/chat';

	static handleInput(input) {
		this.webview.executeJavaScript(`
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

	static handleSubmit(input) {
		this.webview.executeJavaScript(`
        var btn = document.querySelector("textarea[placeholder*='Send a message']+button");
        btn.disabled = false;
        btn.click();
      `);
	}

	static handleCss() {
		this.webview.addEventListener(
			'dom-ready', () => {
				// hide message below text input, sidebar, suggestions on new chat
				this.webview.insertCSS(`
          .text-xs.text-center {
            opacity: 0;
            height: 0;
            margin-bottom: -10px;
          }

          .sticky,
          .pointer-events-auto.flex.border-orange-500,
          [class*="shared__Capabilities"] {
            display: none !important;
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

          .flex-shrink-0.flex.flex-col.relative.items-end {
            display: none !important;
          }

        `);
			}
		);
	}

	static isEnabled() {
		return store.get('webviewOAIEnabled', true);
	}
}

/* Google Bard -------------------------------------------------------------- */

class Bard extends Provider {
	static webviewId = 'webviewBARD';
	static webview = document.getElementById('webviewBARD');

	static url = 'https://bard.google.com';

	static handleInput(input) {
		this.webview.executeJavaScript(`
      var inputElement = document.querySelector("#mat-input-0");

      // try to send keyboard event to trigger the re-enable of the disabled button
      // thanks chatgpt!
      var event = new Event('input', { bubbles: true });
      event.simulated = true;
      var tracker = inputElement._valueTracker;
      if (tracker) {
        tracker.setValue("${input}");
      }
      // Dispatch the event after a short delay to fix the button state
      setTimeout(function() {
        inputElement.dispatchEvent(event);
      }, 100);
      inputElement.value = "${input}"`);
	}

	static handleSubmit(input) {
		this.webview.executeJavaScript(`
        var inputElement = document.querySelector("#mat-input-0");

        // try to send keyboard event to trigger the re-enable of the disabled button
        // thanks chatgpt!
        var event = new Event('input', { bubbles: true });
        event.simulated = true;
        var tracker = inputElement._valueTracker;
        if (tracker) {
          tracker.setValue("${input}");
        }
        inputElement.dispatchEvent(event);
        inputElement.value = "${input}"
        var btn = document.querySelector("button[aria-label*='Send message']");
        btn.setAttribute("aria-disabled", "false"); // doesnt work alone
        btn.click()
      `);
	}

	static handleCss() {
		this.webview.addEventListener(
			'dom-ready', () => {
				// hide message below text input, sidebar, suggestions on new chat
				this.webview.insertCSS(`
          .chat-history, .conversation-container, .input-area, .mdc-text-area {
            margin: 0 !important;
          }
          /* hide the bard greeting */
          response-container {
                display: none;
          }
          model-response response-container {
                display: block !important;
          }
          /* hide header and footer */
          .gmat-caption {
            opacity: 0;
            height: 0;
          }
          header {
            display: none !important;
          }
          header + div {
            display: none !important;
          }
          .capabilities-disclaimer {
            display: none !important;
          }
          .input-area-container .input-area {
            padding: 0;
          }
          /* hide the bard avatar in response */
          .logo-gutter {
            display: none !important;
          }
        `);
			}
		);
	}

	static isEnabled() {
		return store.get('webviewBARDEnabled', true);
	}
}

/* Anthropic Claude --------------------------------------------------------- */

class Claude extends Provider {
	static webviewId = 'webviewCLAUDE';
	static webview = document.getElementById('webviewCLAUDE');

	static url = 'https://console.anthropic.com/chat/new';

	static handleInput(input) {
		this.webview.executeJavaScript(`
    var inputElement = document.querySelector('div.ProseMirror')
    inputElement.innerHTML = "${input}"`);
	}

	static handleSubmit(input) {
		this.webview.executeJavaScript(`
    var btn = document.querySelector('div.group.flex.p-3 button:has(svg)'); // YES we are using the has selector!!!!
    btn.disabled = false;
    btn.click()`);
	}

	static handleCss() {
		this.webview.addEventListener(
			'dom-ready', () => {
				// hide message below text input, sidebar, suggestions on new chat
				setTimeout(() => {
					this.webview.insertCSS(`
        header, .container {
          background-color: white;
          /* single line dark mode ftw */
          filter: invert(100%) hue-rotate(180deg);
        }
        /* hide the claude avatar in response */
        .p-1.w-9.h-9.shrink-0 {
          display: none;
        }
        /* reduce claude prompt margins */
        .mx-4.md\:mx-12.mb-2.md\:mb-4.mt-2.w-auto {
          margin: 0 !important;
        }
        `);
				}, 1000);
			}
		);
	}

	static isEnabled() {
		return store.get('webviewCLAUDEEnabled', true);
	}
}

console.log('Loading providers...');

/* END Providers ------------------------------------------------------------ */

/* ========================================================================== */
/* Create Panes                                                               */
/* ========================================================================== */

// Maps a provider to each pane.
// Future: will be configurable by the user
let paneProviders = [Bard, OpenAi, Claude];

// Create the panes based on the mapping
paneProviders.forEach(provider => {

	const providerPane = document.getElementById(`${provider.name.toLowerCase()}Pane`);
	providerPane.classList.remove('hidden');

});

// add event listener for btn
const promptEl = document.getElementById('prompt');

// Submit prompt when the user presses Enter or Ctrl+Enter in the textarea input
const SuperPromptEnterKey = store.get('SuperPromptEnterKey', false);

// Submit the prompt by preccing Ctrl+Enter or Enter
promptEl.addEventListener('keydown', function (event) {
	const isCmdOrCtrl = event.metaKey || event.ctrlKey;
	const isEnter = event.key === 'Enter';

	if ((SuperPromptEnterKey && isEnter) || (isCmdOrCtrl && isEnter)) {
		event.preventDefault();
		document.getElementById('btn').click();
	}
});

// Sanitize input and send to all providers
promptEl.addEventListener('input', function (event) {
	const sanitizedInput = promptEl.value
		.replace(/"/g, '\\"')
		.replace(/\n/g, '\\n');

	Bard.handleInput(sanitizedInput);
	OpenAi.handleInput(sanitizedInput);
	Claude.handleInput(Claude.webview, sanitizedInput);
});

const form = document.getElementById('form');

// Submit prompt to all providers
form.addEventListener('submit', function (event) {
	const sanitizedInput = promptEl.value
		.replace(/"/g, '\\"')
		.replace(/\n/g, '\\n');
	promptEl.value = '';
	event.preventDefault();
	Bard.handleSubmit(sanitizedInput);
	OpenAi.handleSubmit(sanitizedInput);
	Claude.handleSubmit(sanitizedInput);
});

// Adjust styling for enabled providers
Bard.handleCss();
OpenAi.handleCss();
Claude.handleCss(Claude.webview);

// fix double-pasting inside webviews
OpenAi.setupCustomPasteBehavior();
Bard.setupCustomPasteBehavior();
Claude.setupCustomPasteBehavior();


/* ========================================================================== */
/* Window Panes and Provider Mapping                                          */
/* ========================================================================== */


// Create the panes dynamically based on the pane-provider mapping.
Object.keys(paneProviderMapping).forEach(position => {
  const provider = paneProviderMapping[position];

  const pane = document.createElement("div");
  pane.id = `${position}Pane`;
  pane.className = `split page darwin`;

  const webview = document.createElement("webview");
  webview.id = `webview${provider.name}`;
  webview.src = provider.url;
  webview.autosize = "on";

  pane.appendChild(webview);

  document.querySelector(".flex").appendChild(pane);
});

const splitInstance = Split(['#openaiPane', '#bardPane', '#claudePane'], {
	direction: 'horizontal',
	minSize: 0,
});

window.addEventListener('DOMContentLoaded', () => {
	updateSplitSizes();
});

function updateSplitSizes() {
	const sizes = [
		OpenAi.isEnabled ? 33.33 : 0,
		Bard.isEnabled ? 33.33 : 0,
		Claude.isEnabled ? 33.33 : 0,
	];

	const total = sizes.reduce((a, b) => a + b, 0);
	const normalizedSizes = sizes.map(size =>
		total === 0 ? 33.33 : (size / total) * 100
	); // if all disabled, show all
	splitInstance.setSizes(normalizedSizes);
}

const paneStates = {
	1: [true, false, false],
	2: [false, true, false],
	3: [false, false, true],
	a: [true, true, true],
};

document.addEventListener('keydown', event => {
	if ((event.metaKey || event.ctrlKey) && event.key in paneStates) {
		store.set('webviewOAIEnabled', paneStates[event.key][0]);
		store.set('webviewBARDEnabled', paneStates[event.key][1]);
		store.set('webviewCLAUDEEnabled', paneStates[event.key][2]);

		updateSplitSizes();
		event.preventDefault();
	} else if (
		((event.metaKey || event.ctrlKey) && event.key === '+') ||
		event.key === '='
	) {
		webviewOAI.setZoomLevel(webviewOAI.getZoomLevel() + 1);
		webviewBARD.setZoomLevel(webviewBARD.getZoomLevel() + 1);
		webviewCLAUDE.setZoomLevel(webviewCLAUDE.getZoomLevel() + 1);
	} else if ((event.metaKey || event.ctrlKey) && event.key === '-') {
		webviewOAI.setZoomLevel(webviewOAI.getZoomLevel() - 1);
		webviewBARD.setZoomLevel(webviewBARD.getZoomLevel() - 1);
		webviewCLAUDE.setZoomLevel(webviewCLAUDE.getZoomLevel() - 1);
	}
});