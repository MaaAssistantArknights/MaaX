import koffi from 'koffi'

import './types'

const protos = {
  AsstSetUserDir: 'AsstBool AsstSetUserDir(str path)',
  AsstLoadResource: 'AsstBool AsstLoadResource(str path)',
  AsstSetStaticOption: 'AsstBool AsstSetStaticOption(AsstStaticOptionKey key, str value)',

  AsstCreate: 'AsstHandle AsstCreate()',
  AsstCreateEx: 'AsstHandle AsstCreateEx(AsstApiCallback callback, intptr custom_arg)',
  AsstDestroy: 'void AsstDestroy(AsstHandle handle)',

  AsstSetInstanceOption:
    'AsstBool AsstSetInstanceOption(AsstHandle handle, AsstInstanceOptionKey key, str value)',

  // AsstConnect
  AsstAppendTask: 'AsstTaskId AsstAppendTask(AsstHandle handle, str type, str params)',
  AsstSetTaskParams: 'AsstBool AsstSetTaskParams(AsstHandle handle, AsstTaskId id, str params)',

  AsstStart: 'AsstBool AsstStart(AsstHandle handle)',
  AsstStop: 'AsstBool AsstStop(AsstHandle handle)',
  AsstRunning: 'AsstBool AsstRunning(AsstHandle handle)',
  AsstConnected: 'AsstBool AsstConnected(AsstHandle handle)',

  AsstAsyncConnect:
    'AsstAsyncCallId AsstAsyncConnect(AsstHandle handle, str adb_path, str address, str config, AsstBool block)',
  AsstAsyncClick:
    'AsstAsyncCallId AsstAsyncClick(AsstHandle handle, int32 x, int32 y, AsstBool block)',
  AsstAsyncScreencap: 'AsstAsyncCallId AsstAsyncScreencap(AsstHandle handle, AsstBool block)',

  AsstGetImage: 'AsstSize AsstGetImage(AsstHandle, _Out_ void* buff, AsstSize buff_size)',
  AsstGetUUID: 'AsstSize AsstGetUUID(AsstHandle, _Out_ char* buff, AsstSize buff_size)',
  AsstGetTasksList:
    'AsstSize AsstGetTasksList(AsstHandle, _Out_ AsstTaskId* buff, AsstSize buff_size)',
  AsstGetNullSize: 'AsstSize AsstGetNullSize()',

  AsstGetVersion: 'str AsstGetVersion()',
  AsstLog: 'void AsstLog(str level, str message)'
}

export type MaaCoreExports = Record<keyof typeof protos, koffi.KoffiFunction>

export function load(lib: koffi.IKoffiLib) {
  const result: Record<string, koffi.KoffiFunction> = {}
  for (const key in protos) {
    result[key] = lib.func(protos[key as keyof typeof protos])
  }
  return result as MaaCoreExports
}
