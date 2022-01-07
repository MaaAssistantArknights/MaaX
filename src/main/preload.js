const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('$ipcRenderer', {
  on(channel, func) {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
  once(channel, func) {
    ipcRenderer.once(channel, (event, ...args) => func(...args));
  },
  send(channel, ...args) {
    ipcRenderer.send(channel, ...args);
  },
  sendSync(channel, ...args) {
    return ipcRenderer.sendSync(channel, ...args);
  },
});

contextBridge.exposeInMainWorld('$storage', {
  get(key) {
    return ipcRenderer.sendSync('electron-store-get', key);
  },
  set(key, val) {
    ipcRenderer.send('electron-store-set', key, val);
  },
  has(key) {
    return ipcRenderer.sendSync('electron-store-has', key);
  },
});
