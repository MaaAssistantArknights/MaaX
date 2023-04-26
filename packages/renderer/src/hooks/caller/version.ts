export const ui = async (): Promise<string> =>
  await window.ipcRenderer.invoke('main.Util:getUiVersion')
export const core = async (): Promise<string | null> =>
  await window.ipcRenderer.invoke('main.CoreLoader:getCoreVersion')

export default {
  ui,
  core,
}
