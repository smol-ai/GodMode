const Store = require('electron-store');
const store = new Store();

const providers = {
  Bard: require('./providers/bard'),
  OpenAi: require('./providers/openai'),
  Bing: require('./providers/bing'),
};

/* ========================================================================== */
/* Create Panes                                                               */
/* ========================================================================== */

/**
 * Create an array of chat enabled providers.
 */
const allProviders = Object.values(providers);
const enabledProviders = allProviders.filter(provider => provider.isEnabled());

/**
 * Grab promptEl, the textarea input element, to handle input events.
 */
const promptEl = document.getElementById('prompt');

// Submit prompt when the user presses Enter or Ctrl+Enter in the textarea input
const SuperPromptEnterKey = store.get('SuperPromptEnterKey', false);



// Adjust styling for enabled providers
// fix double-pasting inside webviews
enabledProviders.forEach(provider => {
	provider.handleCss();
	provider.setupCustomPasteBehavior();
});

// Submit the prompt by pressing Ctrl+Enter or Enter
promptEl.addEventListener('keydown', function (event) {
	const isCmdOrCtrl = event.metaKey || event.ctrlKey;
	const isEnter = event.key === 'Enter';

	if ((SuperPromptEnterKey && isEnter) || (isCmdOrCtrl && isEnter)) {
		event.preventDefault();
		document.getElementById('btn').click();
	}
});

/**
 * Sanitize input and pass it to all providers.
 */
promptEl.addEventListener('input', function (event) {
	const sanitizedInput = promptEl.value
		.replace(/"/g, '\\"')
		.replace(/\n/g, '\\n');

	enabledProviders.forEach(provider => provider.handleInput(sanitizedInput));
});

const form = document.getElementById('form');

// Submit prompt to all providers
form.addEventListener('submit', function (event) {
	const sanitizedInput = promptEl.value
		.replace(/"/g, '\\"')
		.replace(/\n/g, '\\n');
	promptEl.value = '';
	event.preventDefault();

	enabledProviders.forEach(provider => provider.handleSubmit(sanitizedInput));
});

/* END Create Panes --------------------------------------------------------- */

/* ========================================================================== */
/* Window Panes and Provider Mapping                                          */
/* ========================================================================== */


// TODO: Rewrite this to be dynamic based on the paneProviderMapping
const splitInstance = Split(
	['#openaiPane', '#bardPane', '#bingPane'],
	{
		direction: 'horizontal',
		minSize: 0,
	}
);

window.addEventListener('DOMContentLoaded', () => {
	updateSplitSizes();
});

function updateSplitSizes() {

	const paneSize = 1 / enabledProviders.length;
	const sizes = enabledProviders.forEach(() => paneSize);

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


// TODO: Adjust to be dynamic
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
