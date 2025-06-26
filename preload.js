const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  askGPT: (q) => ipcRenderer.invoke('ask-gpt', q)
});
