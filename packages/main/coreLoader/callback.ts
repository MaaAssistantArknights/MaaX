import ffi from '@tigerconnect/ffi-napi'
import ref from '@tigerconnect/ref-napi'
import logger from '@main/utils/logger'
import { ipcMainSend } from '@main/utils/ipc-main'
import { AsstMsg } from '@common/enum/callback'

const callbackHandle = ffi.Callback(
  'void',
  ['int', 'string', ref.refType(ref.types.void)],
  (code: AsstMsg, data: string, customArgs) => {
    logger.silly(code)
    logger.silly(data)
    ipcMainSend('renderer.CoreLoader:callback', {
      code,
      data: JSON.parse(data)
      // customArgs
    })
  }
)

export default callbackHandle
