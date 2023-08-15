import Provider from 'providers/provider';

export interface ProviderInterface {
	new (): Provider;
	webviewId: string;
	getWebview(): HTMLElement;
	url: string;
	paneId(): string;
	setupCustomPasteBehavior(): void;
	handleInput(input: string): void;
	handleSubmit(): void;
	handleCss(): void;
	handleDarkMode(): void;
	getUserAgent(): string;
	isEnabled(): boolean;
	setEnabled(enabled: boolean): void;
}
