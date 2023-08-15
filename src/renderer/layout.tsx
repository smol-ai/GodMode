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

// @ts-ignore
type paneInfo = { webviewId: string; shortName: string };
const defaultPaneList = getEnabledProviders(allProviders).map((x) => ({
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
	React.useEffect(() => {
		window.electron.electronStore.set('paneList', paneList);
	}, [paneList]);
	const resetPaneList = () => setPaneList(defaultPaneList);
	const enabledProviders = paneList.map(
		(x) => allProviders.find((y) => y.webviewId === (x.webviewId || x.id))!
	);
	const nonEnabledProviders = allProviders.filter(
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
	const paneStates: Record<string, number | null> = {};
	for (let i = 0; i < enabledProviders.length; i++) {
		paneStates[`${i + 1}`] = i;
	}
	paneStates['a'] = null;
	paneStates['A'] = null;

	function enterKeyHandler(event: React.KeyboardEvent<HTMLTextAreaElement>) {
		const isCmdOrCtrl = event.metaKey || event.ctrlKey;
		const isEnter = event.key === 'Enter';

		// console.log({ SuperPromptEnterKey, isEnter, isCmdOrCtrl });
		if ((SuperPromptEnterKey && isEnter) || (isCmdOrCtrl && isEnter)) {
			event.preventDefault();
			console.log('superprompt!');
			// formRef.current?.submit();
			enabledProviders.forEach((provider) => {
				// Call provider-specific CSS handling and custom paste setup
				provider.handleSubmit(superprompt);
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
		if (focalIndex !== null) {
			let sizes = new Array(panes.length).fill(0);
			sizes[focalIndex] = remainingWidth - 0 * (panes.length - 1);
			return sizes;
		}

		// Evenly distribute remaining space among all panes
		let remainingPercentage = remainingWidth / panes.length;
		let sizes = new Array(panes.length).fill(remainingPercentage);
		return sizes;
	}

	function onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
		const isCmdOrCtrl = event.metaKey || event.ctrlKey;
		if (isCmdOrCtrl && event.key in paneStates) {
			updateSplitSizes(enabledProviders, paneStates[event.key]);
			// event.preventDefault();
		} else if (
			(isCmdOrCtrl && event.key === '+') ||
			(isCmdOrCtrl && event.key === '=')
		) {
			// Increase zoom level with Cmd/Ctrl + '+' or '='
			enabledProviders.forEach((provider) => {
				provider
					.getWebview()
					// @ts-ignore
					.setZoomLevel(provider.getWebview().getZoomLevel() + 1);
			});
		} else if (isCmdOrCtrl && event.key === '-') {
			// Decrease zoom level with Cmd/Ctrl + '-'
			enabledProviders.forEach((provider) => {
				provider
					.getWebview() // @ts-ignore
					.setZoomLevel(provider.getWebview().getZoomLevel() - 1);
			});
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
	const sizes = updateSplitSizes(enabledProviders);
	console.log({ enabledProviders, paneList, sizes });
	return (
		<div id="windowRef" ref={windowRef}>
			<Split
				// sizes={[10, ...sizes]}
				sizes={sizes}
				minSize={100}
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
					<Pane provider={provider} key={index} />
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
- Quick Open: Cmd+G or Submit: Cmd/Ctrl+Enter (customizable in menu)
- Switch windows: Cmd+1/2/3/A, or Resize windows: Cmd -/+, or Back/Fwd: Cmd H/L
- New chat: Cmd+R or Right-click menubar icon for more options!"
					/>
					<div className="flex items-center justify-center p-4 space-x-2">
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
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
