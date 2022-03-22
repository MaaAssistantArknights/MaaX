export default {
  get: (key: string) => window.ipcRenderer.invoke("storage:get", key),
  set: (key: string, val: any) => window.ipcRenderer.send("storage:set", key, val),
  has: (key: string) => window.ipcRenderer.invoke("storage:has", key),
};
