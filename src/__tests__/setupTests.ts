import '@testing-library/jest-dom';

// Mock window.electron to simulate Electron IPC bridge in tests
Object.defineProperty(window, 'electron', {
	value: {
		ipcRenderer: {
			sendMessage: jest.fn(),
			on: jest.fn().mockReturnValue(() => {}),
			once: jest.fn(),
		},
		electronStore: {
			get: jest
				.fn()
				.mockImplementation(
					(_key: string, defaultValue: unknown) => defaultValue,
				),
			set: jest.fn(),
		},
		browserWindow: {
			reload: jest.fn(),
			getAlwaysOnTop: jest.fn().mockReturnValue(false),
			setAlwaysOnTop: jest.fn(),
			promptHiddenChat: jest.fn(),
			enableOpenAtLogin: jest.fn(),
			disableOpenAtLogin: jest.fn(),
		},
	},
	writable: true,
});

// Mock window.settings to simulate settings IPC bridge in tests
Object.defineProperty(window, 'settings', {
	value: {
		getGlobalShortcut: jest.fn().mockResolvedValue('CommandOrControl+Shift+G'),
		setGlobalShortcut: jest.fn().mockResolvedValue(undefined),
		getFocusSuperprompt: jest.fn().mockResolvedValue(false),
		setFocusSuperprompt: jest.fn().mockResolvedValue(undefined),
		getPlatform: jest.fn().mockResolvedValue('darwin'),
		getOpenAtLogin: jest.fn().mockResolvedValue(false),
	},
	writable: true,
});
