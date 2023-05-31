import type { IpcMainHandleEventType, IpcMainHandleEvent } from './ipcMain'
import type { IpcRendererOnEvent, IpcRendererOnEventType } from './ipcRenderer'

export type * from './ipcMain'
export type * from './ipcRenderer'

type WrapPromise<T> = T extends Promise<any> ? T : Promise<T>

export interface IpcRenderer {
  invoke: <Key extends IpcMainHandleEvent>(
    channel: Key,
    ...args: Parameters<IpcMainHandleEventType[Key]>
  ) => WrapPromise<ReturnType<IpcMainHandleEventType[Key]>>

  on: <Key extends IpcRendererOnEvent>(
    channel: Key,
    listener: (
      event: Electron.IpcRendererEvent,
      ...args: Parameters<IpcRendererOnEventType[Key]>
    ) => void
  ) => Electron.IpcRenderer
  // 这个off到底在不在Renderer上啊, 类型里面好像没有来着
  off: <Key extends IpcRendererOnEvent>(
    channel: Key,
    listener: (
      event: Electron.IpcRendererEvent,
      ...args: Parameters<IpcRendererOnEventType[Key]>
    ) => void
  ) => Electron.IpcRenderer
  removeListener: <Key extends IpcRendererOnEvent>(
    channel: Key,
    listener: (
      event: Electron.IpcRendererEvent,
      ...args: Parameters<IpcRendererOnEventType[Key]>
    ) => void
  ) => Electron.IpcRenderer
  removeAllListeners: <Key extends IpcRendererOnEvent>(channel: Key) => Electron.IpcRenderer
}
