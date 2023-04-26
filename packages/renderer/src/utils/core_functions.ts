import logger from '@/hooks/caller/logger'
import { TouchMode } from '@common/enum/settings'

/**
 * roguelike theme extra resources
 * @returns Promise<boolean>
 */
export async function loadCoreResources (): Promise<void> {
  const basePath = await window.ipcRenderer.invoke('main.CoreLoader:getLibPath')
  // WARN: 改变了原有逻辑, 按类型来看应该传对象而非字符串, 不知道原来是什么情况
  const status = await window.ipcRenderer.invoke('main.CoreLoader:loadResource', { path: basePath })
  logger.info('Load base resources', basePath, status)
}

export async function changeTouchMode (mode: TouchMode): Promise<boolean> {
  // check is RogueTheme contains mode
  if (!Object.values(TouchMode).includes(mode)) {
    logger.error('Invalid touchmode', mode)
    return false
  } else {
    // WARN: 改变了原有逻辑
    return await window.ipcRenderer.invoke('main.CoreLoader:changeTouchMode', { mode })
  }
}
