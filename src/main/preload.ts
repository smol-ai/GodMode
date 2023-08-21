// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example';

const electronHandler = {
	ipcRenderer: {
		sendMessage(channel: Channels, ...args: unknown[]) {
			ipcRenderer.send(channel, ...args);
		},
		on(channel: Channels, func: (...args: unknown[]) => void) {
			const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
				func(...args);
			ipcRenderer.on(channel, subscription);

			return () => {
				ipcRenderer.removeListener(channel, subscription);
			};
		},
		once(channel: Channels, func: (...args: unknown[]) => void) {
			ipcRenderer.once(channel, (_event, ...args) => func(...args));
		},
	},
	// https://gist.github.com/samcodee/d4320006d366a2c47048014644ddc375
	electronStore: {
		get(val: any, def: any) {
			const x = ipcRenderer.sendSync('electron-store-get', val, def);
			return x;
		},
		set(property: any, val: any) {
			ipcRenderer.send('electron-store-set', property, val);
		},
		// Other method you want to add like has(), reset(), etc.
	},
	browserWindow: {
		reload() {
			ipcRenderer.send('reload-browser');
		},
		getAlwaysOnTop() {
			const x = ipcRenderer.sendSync('get-always-on-top');
			return x;
		},
		setAlwaysOnTop(val: any) {
			ipcRenderer.send('set-always-on-top', val);
		},
		promptLlama2(prompt: string) {
			const response = ipcRenderer.sendSync('prompt-llama2', prompt);
			return response;
		},
	},
};

contextBridge.exposeInMainWorld('electron', electronHandler);

contextBridge.exposeInMainWorld('settings', {
	getGlobalShortcut: () => {
		return ipcRenderer.invoke('get-global-shortcut');
	},
	setGlobalShortcut: (shortcut: string) => {
		return ipcRenderer.invoke('set-global-shortcut', shortcut);
	},
	getPlatform: () => {
		return ipcRenderer.invoke('get-platform');
	},
});

export type ElectronHandler = typeof electronHandler;
