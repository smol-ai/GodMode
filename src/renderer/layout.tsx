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

function updateSplitSizes(panes: any[], focalIndex = null) {
    // Handle specific pane focus
    if (focalIndex !== null) {
        let sizes = new Array(panes.length).fill(0);
        sizes[focalIndex] = 100 - 0 * (panes.length - 1);
        return sizes;
    }

    // Evenly distribute remaining space among all panes
    let remainingPercentage = 100 / panes.length;
    let sizes = new Array(panes.length).fill(remainingPercentage);
    return sizes;
}

export default function Layout() {
const [superprompt, setSuperprompt] = React.useState('');

// TODO: Manage enabled providers in a more robust way
const enabledProviders = getEnabledProviders(allProviders);

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
// function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
// function handleSubmit(e: React.KeyboardEvent<HTMLDivElement>) {
//   e.preventDefault();
//   enabledProviders.forEach((provider) => {
//     // Call provider-specific CSS handling and custom paste setup
//     provider.handleSubmit(superprompt);
//   });
// }
const formRef = React.useRef<HTMLDivElement>(null);
const SuperPromptEnterKey = window.electron.electronStore.get(
    'SuperPromptEnterKey',
    false
);
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
const sizes = updateSplitSizes(enabledProviders);
return (
    <div>
    <Split
        sizes={[...sizes]}
        minSize={100}
        expandToMin={false}
        gutterSize={3}
        gutterAlign="center"
        snapOffset={30}
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
            id="prompt"
            value={superprompt}
            onChange={(e) => setSuperprompt(e.target.value)}
            onKeyDown={enterKeyHandler}
            name="prompt"
            placeholder="Enter a superprompt here.
- Quick Open: Cmd+G or Submit: Cmd/Ctrl+Enter (customizable in menu)
- Switch windows: Cmd+1/2/3/A, or Resize windows: Cmd -/+, or Back/Fwd: Cmd H/L
- New chat: Cmd+R or Right-click menubar icon for more options!"
        />
        <button id="btn" type="submit" title="cmd+enter to submit">
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
        </div>
    </div>
    </div>
);
}