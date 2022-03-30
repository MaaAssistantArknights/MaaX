export default {
  load: async () => await (window.ipcRenderer.invoke('asst:load') as Promise<boolean>),
  dispose: async () => await (window.ipcRenderer.invoke('asst:dispose') as Promise<void>)
}
