import logger from '@/hooks/caller/logger'
import useSettingStore from '@/store/settings'

/**
 * for mizuki
 * @returns Promise<boolean>
 */
export async function loadCoreResources (): Promise<void> {
  const settingStore = useSettingStore()
  const basePath = await window.ipcRenderer.invoke('main.CoreLoader:getLibPath') as string
  const extraPath = await window.ipcRenderer.invoke('main.CoreLoader:getExtraRoguePath') as string
  let status = await window.ipcRenderer.invoke('main.CoreLoader:loadResource', basePath)
  logger.info('loadResources', basePath, status)
  if (settingStore.forMizuki) {
    const extraConfigPath = basePath + extraPath
    status = await window.ipcRenderer.invoke('main.CoreLoader:loadResource', extraConfigPath)
    logger.info('loadResources', extraConfigPath, status)
  }
}
