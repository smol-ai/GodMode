import Provider from 'providers/provider';

export interface ProviderInterface {
	new (): Provider;
	fullName: string;
	shortName: string;
	webviewId: string;
	getWebview(): HTMLElement;
	url: string;
	paneId(): string;
	setupCustomPasteBehavior(): void;
	handleInput(input: string): void;
	handleSubmit(input?: string): void;
	handleCss(): void;
	handleDarkMode(bool: boolean): void;
	getUserAgent(): string;
	isEnabled(): boolean;
	setEnabled(enabled: boolean): void;
	clearCookies(): void;
}

export interface Settings {
	getGlobalShortcut: () => string;
	setGlobalShortcut: (shortcut: string) => boolean;
	getPlatform: () => string;
}

// Tell typescript that the window object has a property called settings
declare global {
	interface Window {
		settings: Settings;
	}
}