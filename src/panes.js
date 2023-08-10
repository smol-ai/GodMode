// Import necessary modules
const log = require('electron-log');
const Store = require('electron-store');
const store = new Store();
const { getEnabledProviders } = require('./utils');

/* ========================================================================== */
/* Create Panes                                                               */
/* ========================================================================== */

// Function to create and render webview panes for each provider
function drawPanes(providers) {
	// Get the webview container element
	const container = document.getElementById('webviewContainer');
	// Clear out any existing contents
	container.innerHTML = '';

	// Create a new webview pane for each provider
	providers.forEach((provider) => {
		// Create a new div element and set its class and id
		const div = document.createElement('div');
		div.className = 'page darwin';
		div.id = provider.paneId();

	// Create a title bar
	const titlebar = document.createElement('div');
	titlebar.className = 'titlebar';

	// Add in a h1 with the provider name
	const title = document.createElement('p');
	title.innerHTML = provider.name;
	titlebar.appendChild(title);

	// Add in a button to clear cookies (or any other functionality)
	const clearCookiesButton = document.createElement('button');
	clearCookiesButton.innerHTML = 'Clear Cookies';
	clearCookiesButton.addEventListener('click', provider.clearCookies);
	titlebar.appendChild(clearCookiesButton);

	// append the title bar
	div.appendChild(titlebar);

		// Create a new webview and set its id, source url, and autosize attributes
		const webview = document.createElement('webview');
		webview.id = provider.webviewId;
		webview.src = provider.url;
		// set allowpopups property on webview
		webview.setAttribute('allowpopups', 'true');
		webview.autosize = 'on';
		webview.addEventListener('dom-ready', () => {
			webview.setZoomLevel(-1); // Set initial zoom level here
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

// TODO: Reimplement this so that we're specifying inferred pixel width rather than percentage
// Function to update the split pane sizes evenly
function updateSplitSizes(panes, splitInstance, focalIndex = null) {
  // Calculate the total width of the container
  const containerWidth = splitInstance.getSizes().reduce((acc, val) => acc + val, 0);

  // Calculate the minimum size for each pane in pixels
  const minWidth = 100; // minimum width in pixels
  const minPercentage = (minWidth / containerWidth) * 100;

  // Handle specific pane focus
  if (focalIndex !== null) {
    let sizes = new Array(panes.length).fill(minPercentage);
    sizes[focalIndex] = 100 - minPercentage * (panes.length - 1);
    return splitInstance.setSizes(sizes);
  }

  // Evenly distribute remaining space among all panes
  let remainingPercentage = 100 - minPercentage * panes.length;
  let sizes = panes.map(() => minPercentage + (remainingPercentage / panes.length));

  log.info('sizes', sizes);
  return splitInstance.setSizes(sizes);
}

module.exports = {
	drawPanes,
	updateSplitSizes,
};
