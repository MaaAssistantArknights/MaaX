export const getSystemInformation = async (): Promise<any> =>
  await window.ipcRenderer.invoke('main.Util:getSystemInformation')
