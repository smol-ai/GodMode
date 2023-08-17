import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useEffect, useState } from 'react';
import { Settings } from 'lib/types';
import { Button } from './ui/button';
import { convertKeyCode } from 'lib/utils';

export default function SettingsMenu({
	open,
	onClose,
}: {
	open: boolean;
	onClose: () => void;
}) {
	const [shortcut, setShortcut] = useState<string[]>([]);
	const [isRecording, setIsRecording] = useState(false);

	const settings = window.settings as Settings;
	const metaKey = settings.getPlatform() === 'darwin' ? 'Command' : 'Super';

	const onlyShiftPressed = () =>
		modifierKeySet.size === 1 && modifierKeySet.has('Shift');
	const validModifierKeys = () =>
		modifierKeySet.size > 0 && !onlyShiftPressed();

	let modifierKeySet = new Set();
	let interimShift = false;
	const modifierKeys = new Set(['Control', 'Shift', 'Alt', 'Meta']);

	function recordShortcut(event: KeyboardEvent) {
		event.preventDefault();
		if (!isRecording) return;

		const { key } = event;

		if (key === 'Shift') interimShift = true;

		if (modifierKeys.has(key)) {
			if (interimShift) modifierKeySet.add('Shift');
			const otherKey = key === 'Meta' ? metaKey : key;
			modifierKeySet.add(otherKey);
		}

		if (key.length === 1 && validModifierKeys()) {
			const nonModifiedKey = convertKeyCode(event.code);
			const finalShortcut = Array.from(modifierKeySet).concat(
				nonModifiedKey
			) as string[];
			setShortcut(finalShortcut);
			modifierKeySet = new Set();
			setIsRecording(false);
		}
	}

	function keyUp(event: KeyboardEvent) {
		event.preventDefault();
		if (!isRecording) return;
		const { key } = event;

		if (key === 'Escape') setIsRecording(false);
		if (key === 'Shift') interimShift = false;
		if (modifierKeys.has(key)) modifierKeySet.delete(key);
	}

    // Set the shortcut from the main process on mount
	useEffect(() => {
        const displayShortcut = async () => {
            const initialShortcut = await settings.getGlobalShortcut();
            console.log('initialShortcut', initialShortcut)
            setShortcut(initialShortcut?.split('+'));
        }
        displayShortcut();
    }, []);

    // Whenever shortcut is updated, update the main process
	useEffect(() => {
		if (!shortcut || shortcut?.length === 0) return;

		const shortcutString = shortcut?.join('+');
		settings.setGlobalShortcut(shortcutString);
        console.log('shortcut', settings.getGlobalShortcut())
	}, [shortcut]);

    // Turn on key listeners when recording shortcuts
    useEffect(() => {
        if (isRecording) {
            window.addEventListener('keydown', recordShortcut);
            window.addEventListener('keyup', keyUp);
        } else {
            window.removeEventListener('keydown', recordShortcut);
            window.removeEventListener('keyup', keyUp);
        }
    }, [isRecording])

    // Turn off recording when the dialog is closed
    useEffect(() => {
        if (!open) setIsRecording(false);
    }, [open])

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="bg-white">
				<DialogHeader>
					<DialogTitle>Settings</DialogTitle>
				</DialogHeader>
				<div id="accelerator-container" className='flex flex-row justify-center'>
                    {shortcut?.map((key, index) => (
                        <div key={index} className='flex items-center'>
                            <div className='bg-gray-200 dark:bg-gray:700 rounded-md px-2 py-1 text-xs'>{key}</div>
                            <div className='mx-2 text-sm'>{index < shortcut.length - 1 && '+'}</div>
                        </div>
                    ))}
				</div>
					<Button onClick={() => setIsRecording(true)} variant='outline' className=''>
						{isRecording ? 'Recording...' : 'Record shortcut'}
					</Button>
			</DialogContent>
		</Dialog>
	);
}
