import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
// import icon from '../../assets/icon.svg';
// https://electron-react-boilerplate.js.org/docs/styling#tailwind-integration
import Pane from 'components/pane';
import { allProviders } from 'lib/constants';
import React from 'react';
import Split from 'react-split';
import 'tailwindcss/tailwind.css';
import { getEnabledProviders } from 'lib/utils';
import './App.css';
import { BrowserPane } from './browserPane';
import { ProviderInterface } from 'lib/types';
import { TitleBar } from './TitleBar';
import SettingsMenu from './components/settings';
import { promptCritic, promptImprover } from './promptImprover';
// @ts-ignore
import vex from 'vex-js';

// Main css
import 'vex-js/dist/css/vex.css';

// Themes (Import all themes you want to use here)
import 'vex-js/dist/css/vex-theme-default.css';
import 'vex-js/dist/css/vex-theme-os.css';
vex.registerPlugin(require('vex-dialog'));
vex.defaultOptions.className = 'vex-theme-os';

// @ts-ignore
export type paneInfo = { webviewId: string; shortName: string };
const defaultPaneList = getEnabledProviders(
	allProviders as ProviderInterface[],
).map((x) => ({
	webviewId: x.webviewId,
	shortName: x.shortName,
})); // in future we will have to disconnect the provider from the webview Id
const storedPaneList: paneInfo[] = window.electron.electronStore.get(
	'paneList',
	defaultPaneList,
);

export default function Layout() {
	const [superprompt, setSuperprompt] = React.useState('');
	const [paneList, setPaneList] = React.useState(storedPaneList);
	const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

	const originalAlwaysOnTop = window.electron.browserWindow.getAlwaysOnTop();
	const [isAlwaysOnTop, setisAlwaysOnTop] = React.useState(originalAlwaysOnTop);
	const toggleIsAlwaysOnTop = () => {
		const newstate = window.electron.browserWindow.getAlwaysOnTop();
		setisAlwaysOnTop(!newstate);
		window.electron.browserWindow.setAlwaysOnTop(!newstate);
	};

	const enabledProviders = paneList.map(
		(x) => allProviders.find((y) => y.webviewId === (x.webviewId || x.id))!,
	);

	const [sizes, setSizes] = React.useState(updateSplitSizes(enabledProviders));

	React.useEffect(() => {
		window.electron.electronStore.set('paneList', paneList);
	}, [paneList]);

	const resetPaneList = () => setPaneList(defaultPaneList);

	const nonEnabledProviders: ProviderInterface[] = allProviders.filter(
		(x) => !enabledProviders.includes(x),
	);

	/*
	 * Apply provider-specific CSS and custom paste behavior
	 */
	React.useEffect(() => {
		enabledProviders.forEach((provider) => {
			provider.handleCss();
			provider.setupCustomPasteBehavior();
		});
	}, [enabledProviders]);

	React.useEffect(() => {
		if (superprompt) {
			enabledProviders.forEach((provider) => {
				// Call provider-specific CSS handling and custom paste setup
				try {
					provider.handleInput(superprompt);
				} catch (err) {
					console.error('error settling ' + provider.paneId(), err);
				}
			});
		}
	}, [enabledProviders, superprompt]);

	const formRef = React.useRef<HTMLDivElement>(null); // don't actually use a <form> because it will just reload on submit even if you preventdefault
	const SuperPromptEnterKey = window.electron.electronStore.get(
		'SuperPromptEnterKey',
		false,
	);

	function submitProviders() {
		enabledProviders.forEach((provider) => {
			provider.handleSubmit();
		});
	}

	function enterKeyHandler(event: React.KeyboardEvent<HTMLTextAreaElement>) {
		const isCmdOrCtrl = event.metaKey || event.ctrlKey;
		const isEnter = event.key === 'Enter';

		if ((SuperPromptEnterKey && isEnter) || (isCmdOrCtrl && isEnter)) {
			event.preventDefault();
			submitProviders();
		}
	}

	const windowRef = React.useRef<HTMLDivElement>(null);

	function updateSplitSizes(panes: any[], focalIndex: number | null = null) {
		// const clientWidth = windowRef.current?.clientWidth!;
		// const remainingWidth = ((clientWidth - 100) / clientWidth) * 100;
		const remainingWidth = 100;
		// Handle specific pane focus
		if (focalIndex !== null || focalIndex === 'A') {
			let sizes = new Array(panes.length).fill(0);
			sizes[focalIndex] = remainingWidth;
			return sizes;
		} else {
			// Evenly distribute remaining space among all panes
			let remainingPercentage = remainingWidth / panes.length;
			let sizes = new Array(panes.length).fill(remainingPercentage);
			return sizes;
		}
	}

	const paneShortcutKeys: Record<string, number | null> = {};
	for (let i = 0; i < enabledProviders.length; i++) {
		paneShortcutKeys[`${i + 1}`] = i;
	}

	console.warn('paneShortcutKeys', paneShortcutKeys);

	const [currentlyOpenPreviewPane, setOpenPreviewPane] = React.useState(0);
	const closePreviewPane = () => setOpenPreviewPane(0);

	function onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
		const isCmdOrCtrl = event.metaKey || event.ctrlKey;
		const isShift = event.shiftKey;
		console.debug('keydown', event.key, isCmdOrCtrl, event);
		if (isCmdOrCtrl && !isShift && event.key in paneShortcutKeys) {
			if (paneShortcutKeys[event.key] === null) {
				window.electron.browserWindow.reload(); // this is a hack; setSizes by itself does not seem to update the splits, seems like a bug, but we dont have a choice here
			} else {
				setOpenPreviewPane(+event.key);
			}
		} else if (isCmdOrCtrl && isShift && event.key === 'a') {
			window.electron.browserWindow.reload();
		} else if (
			(isCmdOrCtrl && event.key === '+') ||
			(isCmdOrCtrl && event.key === '=')
		) {
			// Increase zoom level with Cmd/Ctrl + '+' or '='
			enabledProviders.forEach((provider) => {
				// @ts-ignore
				provider
					.getWebview()
					// @ts-ignore
					.setZoomLevel(provider.getWebview().getZoomLevel() + 1);
			});
		} else if (isCmdOrCtrl && event.key === '-') {
			// Decrease zoom level with Cmd/Ctrl + '-'
			enabledProviders.forEach((provider) => {
				// @ts-ignore
				provider
					.getWebview()
					// @ts-ignore
					.setZoomLevel(provider.getWebview().getZoomLevel() - 1);
			});
		} else if (isCmdOrCtrl && event.key === 'p') {
			toggleIsAlwaysOnTop();
		} else if (
			event.shiftKey &&
			event.metaKey &&
			(event.key === 'L' || event.key === 'l')
		) {
			// Toggle dark mode with Cmd/Ctrl + Shift + L
			let isDarkMode = window.electron.electronStore.get('isDarkMode', false);
			isDarkMode = !isDarkMode;
			window.electron.electronStore.set('isDarkMode', isDarkMode);

			enabledProviders.forEach((provider) => {
				provider.handleDarkMode(isDarkMode);
			});
		}

		enterKeyHandler(event);
	}

	return (
		<div id="windowRef" className="flex flex-col" ref={windowRef}>
			<TitleBar {...{ isAlwaysOnTop, toggleIsAlwaysOnTop }} />
			<SettingsMenu
				open={isSettingsOpen}
				onClose={() => setIsSettingsOpen(false)}
			/>
			<Split
				sizes={sizes}
				minSize={0}
				expandToMin={false}
				gutterSize={3}
				gutterAlign="center"
				// snapOffset={30}
				dragInterval={1}
				direction="horizontal"
				// cursor="col-resize"
				className="flex"
			>
				{enabledProviders.map((provider, index) => (
					<Pane
						provider={provider as ProviderInterface}
						number={index + 1}
						currentlyOpenPreviewPane={currentlyOpenPreviewPane}
						setOpenPreviewPane={setOpenPreviewPane}
						key={index}
					/>
				))}
			</Split>
			<div
				// not a form, because the form submit causes a reload for some reason even if we preventdefault.
				ref={formRef}
				id="form"
				className=""
				// onKeyDown={handleSubmit}
			>
				<div id="form-wrapper">
					<textarea
						rows={4}
						className="resize-none"
						id="prompt"
						value={superprompt}
						onChange={(e) => setSuperprompt(e.target.value)}
						onKeyDown={onKeyDown}
						name="prompt"
						placeholder="Enter a superprompt here.
- Quick Open: Cmd+Shift+G or Submit: Cmd/Ctrl+Enter
- Switch windows: Cmd+1/2/3/etc, or Global Resize/Pin: Cmd -/+/p, or Back/Fwd: Cmd H/L
- New chat: Cmd+R or Reset windows evenly: Cmd+Shift+A"
					/>
					<div className="flex items-center justify-center p-4 space-x-2">
						<button
							className="flex items-center justify-center w-12 h-12 p-1 text-white transition bg-gray-600 rounded-lg shadow-inner hover:bg-gray-200"
							id="btn"
							type="button"
							onClick={async () => {
								var llama2response = window.electron.browserWindow.promptLlama2(
									promptCritic(superprompt),
								);
								// console.log('stage 1 response', llama2response);
								llama2response = await new Promise((res) =>
									vex.dialog.prompt({
										unsafeMessage: `
										<div class="title-bar">
												<h1>PromptCritic analysis</h1>
										</div>
										${llama2response.responseHTML}`,
										placeholder: `what you'd like to change about your prompt`,
										callback: res,
									}),
								);
								if (llama2response === null) return;
								// console.log('stage 2 response', llama2response);
								var prospectivePrompt =
									window.electron.browserWindow.promptLlama2(
										promptImprover(superprompt, llama2response),
									);
								// console.log('stage 3 response', prospectivePrompt);

								const textareavalue = prospectivePrompt.responseText.replace(
									/\r|\n/,
									'<br>',
								);
								var finalPrompt: string | null = await new Promise((res) =>
									vex.dialog.prompt({
										unsafeMessage: `
										<div class="title-bar">
												<h1>PromptCritic's Improved suggestion</h1>
										</div>
										${prospectivePrompt.responseHTML}`,
										value: prospectivePrompt.responseText,
										input: `<textarea name="vex" type="text" class="vex-dialog-prompt-input" placeholder="" value="${textareavalue}" rows="4">${textareavalue}</textarea>`,
										placeholder: `your final prompt; copy and paste from above if it helps`,
										callback: (data: any) => {
											console.log({ data });
											if (!data) {
												console.log('Cancelled');
											} else {
												res(data);
											}
										},
									}),
								);
								console.log('finalPrompt', finalPrompt);
								if (finalPrompt != null) {
									setSuperprompt(finalPrompt);
								}
							}}
						>
							<svg
								width="15"
								height="15"
								viewBox="0 0 15 15"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M13.9 0.499976C13.9 0.279062 13.7209 0.0999756 13.5 0.0999756C13.2791 0.0999756 13.1 0.279062 13.1 0.499976V1.09998H12.5C12.2791 1.09998 12.1 1.27906 12.1 1.49998C12.1 1.72089 12.2791 1.89998 12.5 1.89998H13.1V2.49998C13.1 2.72089 13.2791 2.89998 13.5 2.89998C13.7209 2.89998 13.9 2.72089 13.9 2.49998V1.89998H14.5C14.7209 1.89998 14.9 1.72089 14.9 1.49998C14.9 1.27906 14.7209 1.09998 14.5 1.09998H13.9V0.499976ZM11.8536 3.14642C12.0488 3.34168 12.0488 3.65826 11.8536 3.85353L10.8536 4.85353C10.6583 5.04879 10.3417 5.04879 10.1465 4.85353C9.9512 4.65827 9.9512 4.34169 10.1465 4.14642L11.1464 3.14643C11.3417 2.95116 11.6583 2.95116 11.8536 3.14642ZM9.85357 5.14642C10.0488 5.34168 10.0488 5.65827 9.85357 5.85353L2.85355 12.8535C2.65829 13.0488 2.34171 13.0488 2.14645 12.8535C1.95118 12.6583 1.95118 12.3417 2.14645 12.1464L9.14646 5.14642C9.34172 4.95116 9.65831 4.95116 9.85357 5.14642ZM13.5 5.09998C13.7209 5.09998 13.9 5.27906 13.9 5.49998V6.09998H14.5C14.7209 6.09998 14.9 6.27906 14.9 6.49998C14.9 6.72089 14.7209 6.89998 14.5 6.89998H13.9V7.49998C13.9 7.72089 13.7209 7.89998 13.5 7.89998C13.2791 7.89998 13.1 7.72089 13.1 7.49998V6.89998H12.5C12.2791 6.89998 12.1 6.72089 12.1 6.49998C12.1 6.27906 12.2791 6.09998 12.5 6.09998H13.1V5.49998C13.1 5.27906 13.2791 5.09998 13.5 5.09998ZM8.90002 0.499976C8.90002 0.279062 8.72093 0.0999756 8.50002 0.0999756C8.2791 0.0999756 8.10002 0.279062 8.10002 0.499976V1.09998H7.50002C7.2791 1.09998 7.10002 1.27906 7.10002 1.49998C7.10002 1.72089 7.2791 1.89998 7.50002 1.89998H8.10002V2.49998C8.10002 2.72089 8.2791 2.89998 8.50002 2.89998C8.72093 2.89998 8.90002 2.72089 8.90002 2.49998V1.89998H9.50002C9.72093 1.89998 9.90002 1.72089 9.90002 1.49998C9.90002 1.27906 9.72093 1.09998 9.50002 1.09998H8.90002V0.499976Z"
									fill="currentColor"
									fillRule="evenodd"
									clipRule="evenodd"
								></path>
							</svg>
						</button>
						<button
							className="flex items-center justify-center w-12 h-12 p-1 text-white transition bg-gray-600 rounded-lg shadow-inner hover:bg-gray-200"
							id="btn"
							onClick={submitProviders}
							type="submit"
							title="cmd+enter to submit"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth="1.5"
								stroke="currentColor"
								className="w-6 h-6"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
								/>
							</svg>
						</button>
						<BrowserPane
							{...{
								paneList,
								setPaneList,
								resetPaneList,
								nonEnabledProviders,
								isAlwaysOnTop,
								toggleIsAlwaysOnTop,
								isSettingsOpen,
								setIsSettingsOpen,
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
