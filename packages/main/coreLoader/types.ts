import type { AsstMsg } from '@type/task/callback'
import koffi from 'koffi'

export const AsstExtAPI = koffi.opaque('AsstExtAPI')
export const AsstHandle = koffi.alias('AsstHandle', 'AsstExtAPI*')
export type AsstHandle = unknown

export const AsstBool = koffi.alias('AsstBool', 'uint8')
export const AsstSize = koffi.alias('AsstSize', 'uint64')

export const AsstId = koffi.alias('AsstId', 'int32')
export const AsstMsgId = koffi.alias('AsstMsgId', 'AsstId')
export const AsstTaskId = koffi.alias('AsstTaskId', 'AsstId')
export type AsstTaskId = number
export const AsstAsyncCallId = koffi.alias('AsstAsyncCallId', 'AsstId')

export const AsstOptionKey = koffi.alias('AsstOptionKey', 'int32')
export const AsstStaticOptionKey = koffi.alias('AsstStaticOptionKey', 'AsstOptionKey')
export const AsstInstanceOptionKey = koffi.alias('AsstInstanceOptionKey', 'AsstOptionKey')

export const AsstApiCallback_Prototype = koffi.proto(
  'void AsstApiCallback_Prototype(AsstMsgId msg, str details_json, intptr custom_arg)'
)

export const AsstApiCallback = koffi.alias(
  'AsstApiCallback',
  koffi.pointer(AsstApiCallback_Prototype)
)
export type AsstApiCallback = (msg: AsstMsg, details_json: string, custom_arg: unknown) => void