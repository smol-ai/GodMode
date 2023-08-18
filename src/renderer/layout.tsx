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
	allProviders as ProviderInterface[]
).map((x) => ({
	webviewId: x.webviewId,
	shortName: x.shortName,
})); // in future we will have to disconnect the provider from the webview Id
const storedPaneList: paneInfo[] = window.electron.electronStore.get(
	'paneList',
	defaultPaneList
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
		(x) => allProviders.find((y) => y.webviewId === (x.webviewId || x.id))!
	);

	const [sizes, setSizes] = React.useState(updateSplitSizes(enabledProviders));

	React.useEffect(() => {
		window.electron.electronStore.set('paneList', paneList);
	}, [paneList]);

	const resetPaneList = () => setPaneList(defaultPaneList);

	const nonEnabledProviders: ProviderInterface[] = allProviders.filter(
		(x) => !enabledProviders.includes(x)
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
		false
	);

	function enterKeyHandler(event: React.KeyboardEvent<HTMLTextAreaElement>) {
		const isCmdOrCtrl = event.metaKey || event.ctrlKey;
		const isEnter = event.key === 'Enter';

		if ((SuperPromptEnterKey && isEnter) || (isCmdOrCtrl && isEnter)) {
			event.preventDefault();
			// formRef.current?.submit();
			enabledProviders.forEach((provider) => {
				// Call provider-specific CSS handling and custom paste setup
				provider.handleSubmit();
			});
		}
		// if (isEnter) {
		//   event.preventDefault();
		// }
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
									promptCritic(superprompt)
								);
								console.log('stage 1 response', llama2response);
								llama2response = await new Promise((res) =>
									vex.dialog.prompt({
										message: 'PromptCritic analysis: ' + llama2response,
										placeholder: `what you'd like to change about your prompt`,
										callback: res,
									})
								);
								if (llama2response === null) return;
								console.log('stage 2 response', llama2response);
								llama2response = window.electron.browserWindow.promptLlama2(
									promptImprover(superprompt, llama2response)
								);
								console.log('stage 3 response', llama2response);
								var accept = await new Promise((res) =>
									vex.dialog.prompt({
										message: 'llama2 says: ' + llama2response,
										callback: res,
									})
								);
								if (accept) {
									setSuperprompt(llama2response);
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
									d="M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82707 7.49972C1.82707 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82707 10.6327 1.82707 7.49972ZM7.50003 4C7.77617 4 8.00003 4.22386 8.00003 4.5V7H10.5C10.7762 7 11 7.22386 11 7.5C11 7.77614 10.7762 8 10.5 8H8.00003V10.5C8.00003 10.7761 7.77617 11 7.50003 11C7.22389 11 7.00003 10.7761 7.00003 10.5V8H4.50003C4.22389 8 4.00003 7.77614 4.00003 7.5C4.00003 7.22386 4.22389 7 4.50003 7H7.00003V4.5C7.00003 4.22386 7.22389 4 7.50003 4Z"
									fill="currentColor"
									fillRule="evenodd"
									clipRule="evenodd"
								></path>
							</svg>
						</button>
						<button
							className="flex items-center justify-center w-12 h-12 p-1 text-white transition bg-gray-600 rounded-lg shadow-inner hover:bg-gray-200"
							id="btn"
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
