import type { IpcRendererOnEventProxy, IpcMainHandleEventCalleeProxy } from '@type/ipc'

export {}

declare global {
  var renderer: IpcRendererOnEventProxy
  var main: IpcMainHandleEventCalleeProxy
}
