export default {
  get: async (key: string) => await window.ipcRenderer.invoke('main.StorageManager:get', key),
  set: async (key: string, val: any) => await window.ipcRenderer.invoke('main.StorageManager:set', key, val),
  has: async (key: string) => await window.ipcRenderer.invoke('main.StorageManager:has', key)
}
