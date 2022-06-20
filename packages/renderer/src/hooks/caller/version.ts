export default {
  ui: async () => await (window.ipcRenderer.invoke('main.Util:getUiVersion') as Promise<string>),
  core: async () => await (window.ipcRenderer.invoke('main.CoreLoader:getCoreVersion') as Promise<string | null>)
}
