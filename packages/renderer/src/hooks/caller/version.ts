export default {
  ui: async () => await (window.ipcRenderer.invoke('version:ui') as Promise<string>),
  core: async () => await (window.ipcRenderer.invoke('version:core') as Promise<string | null>)
}
