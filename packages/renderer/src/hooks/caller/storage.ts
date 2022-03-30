export default {
  get: async (key: string) => await window.ipcRenderer.invoke('storage:get', key),
  set: async (key: string, val: any) => await window.ipcRenderer.invoke('storage:set', key, val),
  has: async (key: string) => await window.ipcRenderer.invoke('storage:has', key)
}
