const log = require('electron-log');

const Store = require('electron-store');
const store = new Store();

const providers = {
	OpenAi: require('./providers/openai'),
	Bard: require('./providers/bard'),
	Bing: require('./providers/bing'),
	Claude: require('./providers/claude'),
};

/* ========================================================================== */
/* Create Panes                                                               */
/* ========================================================================== */

const allProviders = Object.values(providers);
const enabledProviders = allProviders.filter(provider => provider.isEnabled());

const container = document.getElementById('webviewContainer');

enabledProviders.forEach(provider => {
	const div = document.createElement('div');
	div.className = 'page darwin';
	div.id = provider.paneId();

	const webview = document.createElement('webview');
	webview.id = provider.webviewId;
	webview.src = provider.url;
	webview.autosize = 'on';

	// Currently only used by Bing
	if (provider.getUserAgent) {
		webview.useragent = provider.getUserAgent();
	}

	div.appendChild(webview);
	container.appendChild(div);

	provider.handleCss();
	provider.setupCustomPasteBehavior();
});

/* ========================================================================== */
/* Split Panes                                                                */
/* ========================================================================== */

// Create array of pane IDs from webview panes created above
const panes = enabledProviders.map(provider => `#${provider.paneId()}`);
log.info('panes', panes);

// Create Split.js instance
const splitInstance = Split(panes, {
	direction: 'horizontal',
	minSize: 0,
});

// Distribute panes evenly when a pane is enabled or disabled
function updateSplitSizes() {
	const enabledProviders = allProviders.filter(provider => provider.isEnabled());
	const paneSize = (1 / enabledProviders.length) * 100;
	const sizes = new Array(enabledProviders.length).fill(paneSize);
	splitInstance.setSizes(sizes);
}

// Update split sizes once the Electron app DOM is ready
window.addEventListener('DOMContentLoaded', () => {
	updateSplitSizes();
});

/* ========================================================================== */
/* Prompt Input Listeners                                                     */
/* ========================================================================== */

// Get the textarea input
const promptEl = document.getElementById('prompt');

// Submit prompt when the user presses Enter or Ctrl+Enter in the textarea input
const SuperPromptEnterKey = store.get('SuperPromptEnterKey', false);

// Submit the prompt by pressing Ctrl+Enter or Enter
promptEl.addEventListener('keydown', function (event) {
	const isCmdOrCtrl = event.metaKey || event.ctrlKey;
	const isEnter = event.key === 'Enter';

	if ((SuperPromptEnterKey && isEnter) || (isCmdOrCtrl && isEnter)) {
		event.preventDefault();
		document.getElementById('btn').click();
	}
});

// Update all providers when the user types in the textarea input
promptEl.addEventListener('input', function (event) {
	const sanitizedInput = promptEl.value
		.replace(/"/g, '\\"')
		.replace(/\n/g, '\\n');

	enabledProviders.forEach(provider => provider.handleInput(sanitizedInput));
});

const form = document.getElementById('form');

// Submit prompt to all providers when the user clicks the submit button
form.addEventListener('submit', function (event) {
	const sanitizedInput = promptEl.value
		.replace(/"/g, '\\"')
		.replace(/\n/g, '\\n');
	promptEl.value = '';
	event.preventDefault();

	enabledProviders.forEach(provider => provider.handleSubmit(sanitizedInput));
});

/* ========================================================================== */
/* Pane Adjust Keyboard Shortcuts                                             */
/* ========================================================================== */

// Generate pane states for single provider shortcuts
const paneStates = {};
enabledProviders.forEach((provider, index) => {
	paneStates[index + 1] = enabledProviders.map((_, i) => i === index);
});
paneStates['a'] = enabledProviders.map(() => true);

document.addEventListener('keydown', event => {
	if ((event.metaKey || event.ctrlKey) && event.key in paneStates) {
		paneStates[event.key].forEach((state, index) => {
			if (enabledProviders[index]) {
				// check if webview pane exists for this index
				enabledProviders[index].setEnabled(state);
			}
		});
		updateSplitSizes();
		event.preventDefault();
	} else if (
		((event.metaKey || event.ctrlKey) && event.key === '+') ||
		event.key === '='
	) {
		enabledProviders.forEach((provider) => {
			provider.getWebview().setZoomLevel(provider.getWebview().getZoomLevel() + 1);
		});
	} else if ((event.metaKey || event.ctrlKey) && event.key === '-') {
		enabledProviders.forEach((provider) => {
			provider.getWebview().setZoomLevel(provider.getWebview().getZoomLevel() - 1);
		});
	}
});
