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
    return ipcRenderer.sendSync('storage:get', key);
  },
  set(key, val) {
    ipcRenderer.send('storage:set', key, val);
  },
  has(key) {
    return ipcRenderer.sendSync('storage:has', key);
  },
});
