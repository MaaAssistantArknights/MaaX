import logger from '@/hooks/caller/logger'
import { TouchMode, TouchModes } from '@type/misc'
import type { ResourceType } from '@type/game'

/**
 * load core resources, include other server clients
 * @returns Promise<boolean>
 */
export async function loadCoreResources(type: ResourceType): Promise<boolean> {
  const basePath = await window.ipcRenderer.invoke('main.CoreLoader:getLibPath')
  const resourcePath = type === 'CN' ? basePath : basePath + '\\resource' + '\\global' + '\\' + type
  // WARN: 改变了原有逻辑, 按类型来看应该传对象而非字符串, 不知道原来是什么情况
  const status = await window.ipcRenderer.invoke('main.CoreLoader:loadResource', {
    path: resourcePath,
  })
  logger.info(`[LoadResource] type: ${type}, path: ${resourcePath}, status: ${status}`)
  return status
}

export async function changeTouchMode(mode: TouchMode): Promise<boolean> {
  // check is RogueTheme contains mode
  if (!TouchModes.includes(mode)) {
    logger.error('[TouchMode] Receive invalid touchmode', mode)
    return false
  } else {
    // WARN: 改变了原有逻辑
    return await window.ipcRenderer.invoke('main.CoreLoader:changeTouchMode', {
      mode,
    })
  }
}
