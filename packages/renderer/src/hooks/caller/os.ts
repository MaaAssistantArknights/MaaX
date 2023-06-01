import type { Platform } from '@type/api/maa'

export const getSystemInformation = async (): Promise<any> =>
  await window.main.Util.getSystemInformation()

export const getPlatform = async (): Promise<Platform> => await window.main.Util.getOsPlatform()
