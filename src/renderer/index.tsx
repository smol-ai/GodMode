import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

const safeElectron = {
	ipcRenderer: {
		sendMessage: () => {},
		on: () => () => {},
		once: () => {},
	},
	electronStore: {
		get: (_val: any, def: any) => def,
		set: () => {},
	},
	browserWindow: {
		reload: () => {},
		getAlwaysOnTop: () => false,
		setAlwaysOnTop: () => {},
		promptHiddenChat: () => {},
		enableOpenAtLogin: () => {},
		disableOpenAtLogin: () => {},
	},
};

if (!window.electron) {
	window.electron = safeElectron as any;
}

root.render(<App />);

// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-example', (arg) => {
	// eslint-disable-next-line no-console
	console.log(arg);
});
window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);

window.electron.ipcRenderer.on('perplexity-llama2', (args) => {
	// comes from main.ts ipcMain.on('prompt-hidden-chat',...) sendFn(responseHTML, responseText)
	var target = document.getElementById('streamingPromptResponseContainer');
	if (target) {
		target.innerHTML = args as string;
	}
});
