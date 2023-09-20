import logger from '@/hooks/caller/logger'
import { getPlatform } from '@/hooks/caller/os'
import type { ResourceType } from '@type/game'
import { TouchMode, TouchModes } from '@type/misc'

/**
 * load core resources, include other server clients
 * @returns Promise<boolean>
 */
export async function loadCoreResources(type: ResourceType): Promise<boolean> {
  const platform = await getPlatform()
  const separator = platform === 'windows' ? '\\' : '/'
  const basePath = await window.main.CoreLoader.getLibPath()
  const resourcePath =
    type === 'CN' ? basePath : [basePath, 'resource', 'global', type].join(separator)
  // WARN: 改变了原有逻辑, 按类型来看应该传对象而非字符串, 不知道原来是什么情况
  const resourceStatus = await window.main.CoreLoader.loadResource({
    path: resourcePath,
  })
  const cachePath = [basePath, 'cache', type].join(separator)
  const cacheStatus = await window.main.CoreLoader.loadResource({
    path: cachePath,
  })
  logger.info(
    `[LoadResource] type: ${type}, path: ${resourcePath}, resourceStatus: ${resourceStatus}, cacheStatus: ${cacheStatus}`
  )
  return resourceStatus
}

export async function changeTouchMode(mode: TouchMode): Promise<boolean> {
  // check is RogueTheme contains mode
  if (!TouchModes.includes(mode)) {
    logger.error('[TouchMode] Receive invalid touchmode', mode)
    return false
  } else {
    // WARN: 改变了原有逻辑
    return await window.main.CoreLoader.changeTouchMode({
      mode,
    })
  }
}
