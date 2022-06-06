export default {
  load: async () => await (window.ipcRenderer.invoke('main.CoreLoader:load') as Promise<boolean>),
  dispose: async () => await (window.ipcRenderer.invoke('main.CoreLoader:dispose') as Promise<void>)
}
