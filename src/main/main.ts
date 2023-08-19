/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';

import {
	app,
	BrowserWindow,
	shell,
	screen,
	ipcMain,
	globalShortcut,
	Event,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import Store from 'electron-store';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { isValidShortcut } from '../lib/utils';

let store = new Store();

class AppUpdater {
	constructor() {
		log.transports.file.level = 'info';
		autoUpdater.logger = log;
		autoUpdater.checkForUpdatesAndNotify();
	}
}

let mainWindow: BrowserWindow | null = null;

store.reset();

ipcMain.on('ipc-example', async (event, arg) => {
	const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
	console.log(msgTemplate(arg));
	event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.on('electron-store-get', async (event, val, defaultVal) => {
	event.returnValue = store.get(val, defaultVal);
});

ipcMain.on('electron-store-set', async (event, property, val) => {
	store.set(property, val);
});

ipcMain.on('reload-browser', async (event, property, val) => {
	mainWindow?.reload();
});

ipcMain.on('set-always-on-top', async (event, newVal) => {
	mainWindow?.setAlwaysOnTop(newVal);
});
ipcMain.on('get-always-on-top', async (event, property, val) => {
	const bool = mainWindow?.isAlwaysOnTop();
	event.returnValue = bool;
});

// thanks claude

function timeout(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
async function getLlamaResponse(prompt: string) {
	const win = new BrowserWindow({
		// show: true,
		show: false,
		// titleBarStyle: 'hidden',
		// width: 800,
		// height: 600,
		// webPreferences: {
		// 	webviewTag: true,
		// 	nodeIntegration: true,
		// },
	});
	win.loadURL('https://labs.perplexity.ai');
	return new Promise((resolve, reject) => {
		win.webContents.on('dom-ready', async () => {
			await win.webContents.executeJavaScript(`{
				var selectElement = document.querySelector('#lamma-select');
				selectElement.value = 'llama-2-70b-chat';

        var inputElement = document.querySelector('textarea[placeholder*="Ask"]'); // can be "Ask anything" or "Ask follow-up"
				inputElement.focus();
        var nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
				nativeTextAreaValueSetter.call(inputElement, \`${prompt}\`);

				var event = new Event('input', { bubbles: true});
				inputElement.dispatchEvent(event);
				var buttons = Array.from(document.querySelectorAll('button.bg-super'));
				var buttonsWithSvgPath = buttons.filter(button => button.querySelector('svg path'));
				var button = buttonsWithSvgPath[buttonsWithSvgPath.length - 1];
				button.click();
			}`);
			await timeout(5000);
			// const temp = await win.webContents.executeJavaScript(`
			// [...document.querySelectorAll('.default.font-sans.text-base.text-textMain .prose')].map(x => x.innerHTML)
			// `);
			// console.log('temp', temp);
			const responseHTML = await win.webContents.executeJavaScript(`
			[...document.querySelectorAll('.default.font-sans.text-base.text-textMain .prose')].slice(-1)[0].innerHTML
			`);
			const responseText = await win.webContents.executeJavaScript(`
			[...document.querySelectorAll('.default.font-sans.text-base.text-textMain .prose')].slice(-1)[0].innerText
			`);
			resolve({ responseHTML, responseText });
			win.close();
		});
	});
}
ipcMain.on('prompt-llama2', async (event, val) => {
	const response = await getLlamaResponse(val);
	event.returnValue = response;
});

/*
 * Return the user's device platform (macOS, Windows, Linux) for use in
 * keyboard shortcuts and other platform-specific features in the renderer.
 */
ipcMain.handle('get-platform', () => {
	return process.platform;
});

// ipcMain.on('open-settings-window', () => {
//   createSettingsWindow();
// });

if (process.env.NODE_ENV === 'production') {
	const sourceMapSupport = require('source-map-support');
	sourceMapSupport.install();
}

const isDebug =
	process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
	require('electron-debug')();
}

const installExtensions = async () => {
	const installer = require('electron-devtools-installer');
	const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
	const extensions = ['REACT_DEVELOPER_TOOLS'];

	return installer
		.default(
			extensions.map((name) => installer[name]),
			forceDownload,
		)
		.catch(console.log);
};

const createWindow = async () => {
	if (isDebug) {
		await installExtensions();
	}

	const RESOURCES_PATH = app.isPackaged
		? path.join(process.resourcesPath, 'assets')
		: path.join(__dirname, '../../assets');

	const getAssetPath = (...paths: string[]): string => {
		return path.join(RESOURCES_PATH, ...paths);
	};

	let { width, height } = screen.getPrimaryDisplay().workAreaSize;

	mainWindow = new BrowserWindow({
		show: false,
		// frame: false,
		titleBarStyle: 'hidden',
		width: width - 100,
		height: height - 100,
		icon: getAssetPath('icon.png'),
		// alwaysOnTop: true,
		webPreferences: {
			webviewTag: true,
			nodeIntegration: true,
			preload: app.isPackaged
				? path.join(__dirname, 'preload.js')
				: path.join(__dirname, '../../scripts/dll/preload.js'),
		},
	});

	const nativeImage = require('electron').nativeImage;
	const dockIcon = nativeImage.createFromPath(getAssetPath('icon.png'));

	app.dock.setIcon(dockIcon);
	app.name = 'God Mode';

	mainWindow.loadURL(resolveHtmlPath('index.html'));

	mainWindow.on('ready-to-show', () => {
		if (!mainWindow) {
			throw new Error('"mainWindow" is not defined');
		}
		if (process.env.START_MINIMIZED) {
			mainWindow.minimize();
		} else {
			mainWindow.show();
		}
	});

	mainWindow.on('close', (event: Event) => {
		event?.preventDefault();
		mainWindow?.hide();
	});

	const menuBuilder = new MenuBuilder(mainWindow);
	menuBuilder.buildMenu();

	// // Open urls in the user's browser
	// mainWindow.webContents.setWindowOpenHandler((edata) => {
	// 	shell.openExternal(edata.url);
	// 	return { action: 'allow' };
	// });

	// Remove this if your app does not use auto updates
	// eslint-disable-next-line
	new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
	// Respect the OSX convention of having the application in memory even
	// after all windows have been closed
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('web-contents-created', (e, contents) => {
	if (contents.getType() == 'webview') {
		// contents.on("will-navigate", (event, url, frameName, disposition, options, additionalFeatures) => {
		//   console.log({frameName})
		//   if (frameName === 'my_popup') {
		//     // Open `url` in a new window...
		//     event.preventDefault()
		//     Object.assign(options, {
		//       parent: win,
		//       width: 500,
		//       height: 400
		//     })
		//     event.newGuest = new BrowserWindow(options)
		//   }
		// })
		// // set context menu in webview
		// contextMenu({
		//   window: contents,
		// });

		// we can't set the native app menu with "menubar" so need to manually register these events
		// register cmd+c/cmd+v events
		contents.on('before-input-event', (event, input) => {
			const { control, meta, key } = input;
			if (!control && !meta) return;
			if (key === 'c') contents.copy();
			if (key === 'x') contents.cut();
			// if (key === "v") contents.paste(); // we will handle this manually
			if (key === 'a') contents.selectAll();
			if (key === 'z') contents.undo();
			if (key === 'y') contents.redo();
			if (key === 'q') app.quit();
			if (key === 'r') contents.reload();
			if (key === 'h') contents.goBack();
			if (key === 'l') contents.goForward();
		});
	}
	// // we can't set the native app menu with "menubar" so need to manually register these events
	// // register cmd+c/cmd+v events
	// contents.on('before-input-event', (event, input) => {
	//   const { control, meta, key } = input;
	//   if (!control && !meta) return;
	//   if (key === 'c') contents.copy();
	//   if (key === 'v') contents.paste();
	//   if (key === 'x') contents.cut();
	//   if (key === 'a') contents.selectAll();
	//   if (key === 'z') contents.undo();
	//   if (key === 'y') contents.redo();
	//   if (key === 'q') app.quit();
	//   if (key === 'r') contents.reload();
	//   if (key === 'h') contents.goBack();
	//   if (key === 'l') contents.goForward();
	// });
});

app
	.whenReady()
	.then(() => {
		createWindow();
		app.on('activate', () => {
			// On macOS it's common to re-create a window in the app when the
			// dock icon is clicked and there are no other windows open.
			if (mainWindow === null) createWindow();
		});
	})
	.catch(console.log);

/* ========================================================================== */
/* Global Shortcut Logic                                                      */
/* ========================================================================== */

/*
 * Fetch global shortcut from electron store, or default if none is set
 */
const quickOpenDefaultShortcut = store.get(
	'quickOpenShortcut',
	'CommandOrControl+Shift+G',
) as string;

console.log(quickOpenDefaultShortcut);
console.log(isValidShortcut(quickOpenDefaultShortcut));
/*
 * Update the global shortcut to one provided
 */
function changeGlobalShortcut(newShortcut: string) {
	if (!newShortcut) return;
	if (!isValidShortcut(newShortcut)) return;
	store.set('quickOpenShortcut', newShortcut);
	globalShortcut.register(newShortcut, quickOpen);
}

/*
 * Open and focus the main window
 */
function quickOpen() {
	if (mainWindow && !mainWindow.isDestroyed()) {
		if (mainWindow.isMinimized()) {
			mainWindow.restore();
		}
		mainWindow.show();
		mainWindow.focus();
		// put focus on the #prompt textarea if it is at all present on the document inside mainWindow
		mainWindow.webContents.executeJavaScript(
			`{document.querySelector('#prompt')?.focus()}`,
		);
	}
}

/*
 * Reply to renderer process with the global shortcut
 */
ipcMain.handle('get-global-shortcut', (event) => {
	return store.get('quickOpenShortcut', 'CommandOrControl+Shift+G');
});

/*
 * Set the global shortcut to one provided
 */
ipcMain.handle('set-global-shortcut', async (event, shortcut: string) => {
	if (!shortcut) return false;
	changeGlobalShortcut(shortcut);
	return true;
});

app.on('ready', () => {
	/*
	 * Register global shortcut on app ready
	 */
	if (isValidShortcut(quickOpenDefaultShortcut)) {
		store.set('quickOpenShortcut', quickOpenDefaultShortcut);
		globalShortcut.register(quickOpenDefaultShortcut, quickOpen);
	}

	/*
	 * Re-register global shortcut when it is changed in settings
	 * and unregister the old one
	 */
	store.onDidChange(
		'quickOpenShortcut',
		(newValue: unknown, oldValue: unknown) => {
			if (newValue === oldValue) return;
			changeGlobalShortcut(newValue as string);
		},
	);
});

app.on('will-quit', () => {
	// Unregister the global shortcut
	globalShortcut.unregisterAll();
});
