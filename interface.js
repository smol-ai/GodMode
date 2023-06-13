// Import necessary modules
const log = require('electron-log');
const Store = require('electron-store');
const store = new Store();

// Initialize the providers
const providers = {
	OpenAi: require('./providers/openai'),
	Bard: require('./providers/bard'),
	Bing: require('./providers/bing'),
	Claude: require('./providers/claude'),
};

/* ========================================================================== */
/* Create Panes                                                               */
/* ========================================================================== */

// Get all providers and filter out the enabled ones
const allProviders = Object.values(providers);
const enabledProviders = allProviders.filter(provider => provider.isEnabled());

// Function to create and render webview panes for each provider
function drawPanes(providers) {
	// Get the webview container element
	const container = document.getElementById('webviewContainer');
	// Clear out any existing contents
	container.innerHTML = '';

	// Create a new webview pane for each provider
	providers.forEach(provider => {
		// Create a new div element and set its class and id
		const div = document.createElement('div');
		div.className = 'page darwin';
		div.id = provider.paneId();

		// Create a new webview and set its id, source url, and autosize attributes
		const webview = document.createElement('webview');
		webview.id = provider.webviewId;
		webview.src = provider.url;
		webview.autosize = 'on';
		webview.addEventListener('dom-ready', () => {
			webview.setZoomLevel(0); // Set initial zoom level here
		});

		// If the provider has a getUserAgent function, set the webview's useragent
		if (provider.getUserAgent) {
			webview.useragent = provider.getUserAgent();
		}

		// Append the webview to the div, and the div to the container
		div.appendChild(webview);
		container.appendChild(div);

		// Call provider-specific CSS handling and custom paste setup
		provider.handleCss();
		provider.setupCustomPasteBehavior();
	});
}

// Call the drawPanes function with the enabled providers
drawPanes(enabledProviders);

/* ========================================================================== */
/* Split Panes                                                                */
/* ========================================================================== */

// Create an array of pane IDs for the enabled providers
const panes = enabledProviders.map(provider => `#${provider.paneId()}`);
log.info('panes', panes);

// Initialize the Split.js library to create split views with the pane IDs
const splitInstance = Split(panes, {
	direction: 'horizontal',
	minSize: 0,
});

// Function to update the split pane sizes evenly
function updateSplitSizes() {
	// Get the currently enabled providers and calculate the size for each pane
	const enabledProviders = allProviders.filter(provider => provider.isEnabled());
	const paneSize = (1 / enabledProviders.length) * 100;
	const sizes = new Array(enabledProviders.length).fill(paneSize);
	splitInstance.setSizes(sizes);
}

// Update the split sizes once the Electron app DOM is ready
window.addEventListener('DOMContentLoaded', () => {
	updateSplitSizes();
});

/* ========================================================================== */
/* Prompt Input Listeners                                                     */
/* ========================================================================== */

// Get the textarea input element for the prompt
const promptEl = document.getElementById('prompt');
// Get the key binding for submitting the prompt from the store
const SuperPromptEnterKey = store.get('SuperPromptEnterKey', false);

// Listen for the keydown event to submit the prompt when the user presses
// Enter or Ctrl+Enter
promptEl.addEventListener('keydown', function (event) {
	const isCmdOrCtrl = event.metaKey || event.ctrlKey;
	const isEnter = event.key === 'Enter';

	if ((SuperPromptEnterKey && isEnter) || (isCmdOrCtrl && isEnter)) {
		event.preventDefault();
		document.getElementById('btn').click();
	}
});

// Listen for the input event to update all providers when the user types in
// the textarea input
promptEl.addEventListener('input', function (event) {
	const sanitizedInput = promptEl.value
		.replace(/"/g, '\\"')
		.replace(/\n/g, '\\n');

	// Iterate over each provider and pass the sanitized input to its
	// handleInput function
	enabledProviders.forEach(provider => provider.handleInput(sanitizedInput));
});

const form = document.getElementById('form');

// Listen for the submit event on the form to submit the prompt to all providers
// when the user clicks the submit button
form.addEventListener('submit', function (event) {
	const sanitizedInput = promptEl.value
		.replace(/"/g, '\\"')
		.replace(/\n/g, '\\n');
	// Clear the textarea input
	promptEl.value = '';
	// Prevent the form from actually submitting and refreshing the page
	event.preventDefault();

	// Iterate over each provider and pass the sanitized input to its
	// handleSubmit function
	enabledProviders.forEach(provider => provider.handleSubmit(sanitizedInput));
});

/* ========================================================================== */
/* Pane Adjust Keyboard Shortcuts                                             */
/* ========================================================================== */

// Generate the pane states for the keyboard shortcuts to
// enable/disable providers
const paneStates = {};
enabledProviders.forEach((provider, index) => {
	// Create a state for each provider where only it is enabled
	paneStates[index + 1] = enabledProviders.map((_, i) => i === index);
});
// Create a state where all providers are enabled
paneStates['a'] = enabledProviders.map(() => true);

// Listen for the keydown event for the keyboard shortcuts
document.addEventListener('keydown', event => {

	// If the key pressed is a number or 'a' with either Cmd or Ctrl
	if ((event.metaKey || event.ctrlKey) && event.key in paneStates) {
		// Log the key that was pressed
		log.info('event.key', event.key);
		// Iterate over each state and set the enabled state of corresponding provider
		paneStates[event.key].forEach((state, index) => {
			if (enabledProviders[index]) {
				// check if webview pane exists for this index
				enabledProviders[index].setEnabled(state);
			}
		});
		// Redraw the panes and update their sizes
		drawPanes(enabledProviders);
		updateSplitSizes();
		event.preventDefault();

	} else if (
		// If the key pressed is '+' or '=' with either Cmd or Ctrl, or the
		// key pressed is '=' without Cmd or Ctrl
		((event.metaKey || event.ctrlKey) && event.key === '+') ||
		event.key === '='
	) {
		// Iterate over each provider and increase its zoom level by 1
		enabledProviders.forEach((provider) => {
			provider.getWebview().setZoomLevel(provider.getWebview().getZoomLevel() + 1);
			log.info('zoom level', provider.getWebview().getZoomLevel());
		});
	} else if ((event.metaKey || event.ctrlKey) && event.key === '-') {
		// If the key pressed is '-' with either Cmd or Ctrl
		// Iterate over each provider and decrease its zoom level by 1
		enabledProviders.forEach((provider) => {
			provider.getWebview().setZoomLevel(provider.getWebview().getZoomLevel() - 1);
			log.info(provider.name, 'zoom level', provider.getWebview().getZoomLevel());
		});
	}
});
