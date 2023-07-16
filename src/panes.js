// Import necessary modules
const log = require('electron-log');
const Store = require('electron-store');
const store = new Store();

/* ========================================================================== */
/* Create Panes                                                               */
/* ========================================================================== */

// Function to get the enabled providers from the providers object
function getEnabledProviders(providers) {
	const allProviders = Object.values(providers);
	const customPane0 = store.get(`customPane0`, false);
	const customPane1 = store.get(`customPane1`, false);
	const customPane2 = store.get(`customPane2`, false);
	return [...allProviders.filter(provider => provider.isEnabled()),
	...[customPane0,customPane1,customPane2]
		.map((providerName, i) => {
			if (!providerName) return null;
			provider = allProviders.find(provider => provider.fullName === providerName)
			provider.customPaneId = `customPane${i}`;
			return provider
		})
		.filter(Boolean)
	];
}

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

// Function to update the split pane sizes evenly
function updateSplitSizes(panes, splitInstance, focalIndex = null) {
	// Get the currently enabled providers and calculate the size for each pane
  let sizes = [];
	if (focalIndex !== null) {
    sizes = new Array(panes.length).fill(0);
    sizes[focalIndex] = 100;
  } else {
    const paneSize = (1 / panes.length) * 100;
    sizes = new Array(panes.length).fill(paneSize);
  }
  log.info('sizes', sizes);
  return splitInstance.setSizes(sizes);
}

module.exports = {
  drawPanes,
  getEnabledProviders,
  updateSplitSizes
};