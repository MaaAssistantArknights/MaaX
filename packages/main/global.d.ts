import type { IpcMainHandleEventCalleeProxy, IpcRendererOnEventProxy } from '@type/ipc'

export {}

declare global {
  var renderer: IpcRendererOnEventProxy
  var main: IpcMainHandleEventCalleeProxy
}
