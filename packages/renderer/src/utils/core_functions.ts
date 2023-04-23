import logger from '@/hooks/caller/logger'
import { TouchMode } from '@common/enum/settings'

/**
 * roguelike theme extra resources
 * @returns Promise<boolean>
 */
export async function loadCoreResources (): Promise<void> {
  const basePath = await window.ipcRenderer.invoke('main.CoreLoader:getLibPath') as string
  const status = await window.ipcRenderer.invoke('main.CoreLoader:loadResource', basePath)
  logger.info('Load base resources', basePath, status)
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
