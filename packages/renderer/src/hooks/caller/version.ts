export const ui = async () => await (window.ipcRenderer.invoke('main.Util:getUiVersion') as Promise<string>)
export const core = async () => await (window.ipcRenderer.invoke('main.CoreLoader:getCoreVersion') as Promise<string | null>)

export default {
  ui, core
}