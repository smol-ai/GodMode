const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  getQuickOpenShortcut: () => {
    return ipcRenderer.invoke("getQuickOpenShortcut");
  },
  /**
   * @param {string} shortcut
   */
  setQuickOpenShortcut: (shortcut) => {
    console.log({ shortcut });
    return ipcRenderer.invoke("setQuickOpenShortcut", shortcut);
  },
});
