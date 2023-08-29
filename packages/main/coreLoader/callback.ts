import logger from '@main/utils/logger'
import type { AsstMsg } from '@type/task/callback'
import type { AsstApiCallback } from './types'

export const callbackHandle: AsstApiCallback = (code, data, customArgs) => {
    logger.silly(code)
    logger.silly(data)
    globalThis.renderer.CoreLoader.callback({
      code,
      data: JSON.parse(data),
    })
  }