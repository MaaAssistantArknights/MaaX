export default {
  get: (key: string) => window.ipcRenderer.sendSync("storage:get", key),
  set: (key: string, val: any) => window.ipcRenderer.send("storage:set", key, val),
  has: (key: string) => window.ipcRenderer.sendSync("storage:has", key),
};
