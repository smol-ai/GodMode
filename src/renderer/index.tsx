import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);

// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-example', (arg) => {
	// eslint-disable-next-line no-console
	console.log(arg);
});
window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);

window.electron.ipcRenderer.on('perplexity-llama2', (args: string[]) => {
	console.log(`args[0]`, args[0])
	// comes from main.ts ipcMain.on('prompt-hidden-chat',...) sendFn(responseHTML, responseText)
	document.getElementById('streamingPromptResponseContainer')!.innerHTML  = args[0] as string;
});