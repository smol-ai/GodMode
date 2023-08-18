import { ProviderInterface } from './types';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function getEnabledProviders(allProviders: ProviderInterface[]) {
	return allProviders.filter((provider) => provider.isEnabled());
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
export function convertKeyCode(code: string) {
	return code
		.toUpperCase()
		.replace('KEY', '')
		.replace('DIGIT', '')
		.replace('NUMPAD', 'NUM')
		.replace('COMMA', ',');
}

export type ShortcutKey =
	| 'Command'
	| 'Cmd'
	| 'Control'
	| 'Ctrl'
	| 'CommandOrControl'
	| 'CmdOrCtrl'
	| 'Alt'
	| 'Option'
	| 'AltGr'
	| 'Shift'
	| 'Super'
	| 'Meta';

export const modifierKeys: Set<ShortcutKey> = new Set([
	'Command',
	'Control',
	'Cmd',
	'Ctrl',
	'CmdOrCtrl',
	'CommandOrControl',
	'Alt',
	'Option',
	'AltGr',
	'Shift',
	'Super',
	'Meta',
]);

export function convertModifierKey(key: ShortcutKey | string): string {
	const shortcuts: Record<ShortcutKey, string> = {
		Command: 'CmdOrCtrl',
		Cmd: 'CmdOrCtrl',
		CmdOrCtrl: 'CmdOrCtrl',
		Control: 'Ctrl',
		Ctrl: 'Ctrl',
		CommandOrControl: 'CmdOrCtrl',
		Alt: 'Alt',
		Option: 'Option',
		AltGr: 'AltGr',
		Shift: 'Shift',
		Super: 'CmdOrCtrl',
		Meta: 'CmdOrCtrl',
	};

	const result = shortcuts[key as ShortcutKey] || key;
	return result;
}

// Iterate through shortcut array and confirm there is at least 1 modifier
// and no more than 1 non-modifier key

export function isValidShortcut(...keys: (string | string[])[]): boolean {
	// Track the count of modifier and non-modifier keys
	let modifierCount = 0;
	let nonModifierCount = 0;
	let shiftCount = 0; // Track the count of shift keys

	const shortcut = keys.flatMap((value) =>
		typeof value === 'string' ? value.split('+') : value.flat()
	);

	shortcut.forEach((key) => {
		if (key === 'Shift') {
			shiftCount++;
		} else if (modifierKeys.has(key as ShortcutKey)) {
			modifierCount++;
		} else {
			nonModifierCount++;
		}
	});

	return modifierCount >= 1 && nonModifierCount === 1; // Modify this based on the specific rules for a valid shortcut
}
