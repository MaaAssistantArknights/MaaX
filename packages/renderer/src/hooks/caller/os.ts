import type { Platform } from '@type/api/maa'

export const getSystemInformation = async (): Promise<any> =>
  await window.ipcRenderer.invoke('main.Util:getSystemInformation')

export const getPlatform = async (): Promise<Platform> =>
  await window.ipcRenderer.invoke('main.Util:getOsPlatform')
