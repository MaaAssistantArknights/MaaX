import logger from '@main/utils/logger'
import ffi from '@tigerconnect/ffi-napi'
import ref from '@tigerconnect/ref-napi'
import type { AsstMsg } from '@type/task/callback'

const callbackHandle = ffi.Callback(
  'void',
  ['int', 'string', ref.refType(ref.types.void)],
  (code: AsstMsg, data: string, customArgs) => {
    logger.silly(code)
    logger.silly(data)
    globalThis.renderer.CoreLoader.callback({
      code,
      data: JSON.parse(data),
    })
  }
)

export default callbackHandle
