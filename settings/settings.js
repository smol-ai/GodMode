/**
 * @type {"darwin" | "win32" | "linux"}
 */
let currentPlatform = 'darwin';
/**
 * @type {"Command" | "Super"}
 */
let metaKey = 'Command';
window.settings?.getPlatform?.().then((platform) => {
	// Get the platform from the main process
	currentPlatform = platform;
	metaKey = currentPlatform === 'darwin' ? 'Command' : 'Super';
});

/**
 * @type {string[]}
 */
let shortcut = [];
window.settings?.getQuickOpenShortcut?.().then((accelerator) => {
	// Get the accelerator from the store in the main process
	shortcut = convertAcceleratorToTokens(accelerator);
	updateDOM();
});

/**
 * @type {Set<string>}
 */
let modifierKeySet = new Set();
let interimShift = false;
let isRecording = false;
const modifierKeys = new Set(['Control', 'Shift', 'Alt', 'Meta']);

function convertAcceleratorToTokens(accelerator) {
	return accelerator.split('+').filter(Boolean);
}

function convertTokensToAccelerator(tokens) {
	return tokens.join('+');
}

/**
 * Convert a key code from a Web keyboard event to an Electron key code
 * @param {string} code
 * @returns {string}
 */
function mapWebKeyCodeToElectronKeyCode(code) {
	return code
		.toUpperCase()
		.replace('KEY', '')
		.replace('DIGIT', '')
		.replace('NUMPAD', 'NUM')
		.replace('COMMA', ',');
}

function onlyPressedModifierKeyIsShift() {
	return (
		modifierKeySet.size === 1 && modifierKeySet.has('Shift') && interimShift
	);
}

/**
 * Handle the recording of a keyboard shortcut
 * @param {KeyboardEvent} event
 */
function recordShortcut(event) {
	event.preventDefault();
	if (!isRecording) {
		return;
	}
	const { key } = event;
	if (key === 'Shift') {
		interimShift = true;
	}
	if (interimShift && modifierKeys.has(key)) {
		modifierKeySet.add('Shift');
		if (key === 'Meta') {
			modifierKeySet.add(metaKey);
		} else {
			modifierKeySet.add(key);
		}
	} else if (modifierKeys.has(key)) {
		if (key === 'Meta') {
			modifierKeySet.add(metaKey);
		} else {
			modifierKeySet.add(key);
		}
	} else if (
		key.length === 1 &&
		modifierKeySet.size > 0 &&
		!onlyPressedModifierKeyIsShift()
	) {
		const nonModifiedKey = mapWebKeyCodeToElectronKeyCode(event.code);
		if (interimShift === false) {
			modifierKeySet.delete('Shift');
		}
		const finalShortcut = Array.from(modifierKeySet).concat(nonModifiedKey);
		shortcut = finalShortcut;
		modifierKeySet = new Set();
		interimShift = false;
		isRecording = false;
		window.settings?.setQuickOpenShortcut?.(
			convertTokensToAccelerator(shortcut),
		);
	}

	updateDOM();
}

/**
 * Handle the release of a key
 * @param {KeyboardEvent} event
 */
function keyUp(event) {
	if (!isRecording) return;
	if (event.key === 'Escape') {
		isRecording = false;
	}
	const { key } = event;
	if (event.key === 'Shift') {
		interimShift = false;
	} else if (modifierKeys.has(key)) {
		modifierKeySet.delete(key);
	}
}

function toggleRecording() {
	isRecording = !isRecording;
	updateDOM();
}

function turnRecordingOff() {
	isRecording = false;
	updateDOM();
}

window.addEventListener('keydown', recordShortcut);
window.addEventListener('keyup', keyUp);

// Manually manage the DOM based on state
function updateDOM() {
	const container = document.getElementById('accelerator-container');
	container.innerHTML = '';

	if (!shortcut || shortcut.length === 0) {
		const btn = document.createElement('button');
		btn.textContent = isRecording
			? 'Recording shortcut...'
			: 'Click to record shortcut';
		btn.addEventListener('click', toggleRecording);
		container.appendChild(btn);
	} else {
		const wrapper = document.createElement('div');
		wrapper.classList.add('accelerator-wrapper');
		const shortcutDiv = document.createElement('div');
		shortcutDiv.classList.add('accelerator');
		if (isRecording) {
			const tagDiv = document.createElement('div');
			tagDiv.classList.add('tag', 'in-progress');
			tagDiv.textContent = 'Type shortcut...';
			shortcutDiv.appendChild(tagDiv);
		} else {
			shortcut.forEach((token) => {
				const tagDiv = document.createElement('div');
				tagDiv.classList.add('tag');
				tagDiv.textContent = token;
				shortcutDiv.appendChild(tagDiv);
			});
		}
		const btn = document.createElement('button');
		btn.textContent = isRecording
			? 'Cancel recording'
			: 'Click to record new shortcut';
		btn.addEventListener('click', toggleRecording);
		wrapper.appendChild(shortcutDiv);
		wrapper.appendChild(btn);
		container.appendChild(wrapper);
	}
}

// Initial render
updateDOM();
