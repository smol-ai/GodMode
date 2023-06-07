const Store = require('electron-store');
const store = new Store();

document.getElementById('webviewOAIEnabled').checked = store.get('webviewOAIEnabled', true);
document.getElementById('webviewBARDEnabled').checked = store.get('webviewBARDEnabled', true);
document.getElementById('webviewCLAUDEEnabled').checked = store.get('webviewCLAUDEEnabled', true);
document.getElementById('SuperPromptEnterKey').checked = store.get('SuperPromptEnterKey', false);

document.getElementById('webviewOAIEnabled').addEventListener('change', (event) => {
    store.set('webviewOAIEnabled', event.target.checked);
});

document.getElementById('webviewBARDEnabled').addEventListener('change', (event) => {
    store.set('webviewBARDEnabled', event.target.checked);
});

document.getElementById('webviewCLAUDEEnabled').addEventListener('change', (event) => {
    store.set('webviewCLAUDEEnabled', event.target.checked);
});

document.getElementById('SuperPromptEnterKey').addEventListener('change', (event) => {
    store.set('SuperPromptEnterKey', event.target.checked);
});

document.getElementById('save').addEventListener('click', () => {

    console.log('save clicked');

    // Save the user's preferences
    const webviewOAIEnabled = document.getElementById('webviewOAIEnabled').checked;
    const webviewBARDEnabled = document.getElementById('webviewBARDEnabled').checked;
    const webviewCLAUDEEnabled = document.getElementById('webviewCLAUDEEnabled').checked;
    const SuperPromptEnterKey = document.getElementById('SuperPromptEnterKey').checked;
    store.set('webviewOAIEnabled', webviewOAIEnabled);
    store.set('webviewBARDEnabled', webviewBARDEnabled);
    store.set('webviewCLAUDEEnabled', webviewCLAUDEEnabled);
    store.set('SuperPromptEnterKey', SuperPromptEnterKey);

    // Close the preferences window
    window.close();
});
