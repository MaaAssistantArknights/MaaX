import logger from '@/hooks/caller/logger'
import useSettingStore from '@/store/settings'
import { RogueTheme, TouchMode } from '@common/enum/settings'

/**
 * roguelike theme extra resources
 * @returns Promise<boolean>
 */
export async function loadCoreResources (): Promise<void> {
  const settingStore = useSettingStore()
  const basePath = await window.ipcRenderer.invoke('main.CoreLoader:getLibPath') as string
  const extraPath = await window.ipcRenderer.invoke('main.CoreLoader:getExtraRoguePath') as string
  let status = await window.ipcRenderer.invoke('main.CoreLoader:loadResource', basePath)
  logger.info('Load base resources', basePath, status)
  if (settingStore.rogueTheme === RogueTheme.Mizuki) {
    const extraConfigPath = basePath + extraPath
    status = await window.ipcRenderer.invoke('main.CoreLoader:loadResource', extraConfigPath)
    // eslint-disable-next-line vue/max-len
    logger.info('Load extra resources for roguelike theme \'mizuki\'', extraConfigPath, status === true ? 'success' : 'failed')
  }
}

export async function changeTouchMode (mode: TouchMode): Promise<boolean> {
  // check is RogueTheme contains mode
  if (!Object.values(TouchMode).includes(mode)) {
    logger.error('Invalid touchmode', mode)
    return false
  } else {
    return await window.ipcRenderer.invoke('main.CoreLoader:changeTouchMode', mode)
  }
}
