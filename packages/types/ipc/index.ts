import type {
  IpcMainOnEvent,
  IpcMainHandleEventType,
  IpcMainHandleEvent,
  IpcMainOnEventType,
} from './ipcMain'
import type { IpcRendererOnEvent, IpcRendererOnEventType } from './ipcRenderer'

export type * from './ipcMain'
export type * from './ipcRenderer'

type WrapPromise<T> = T extends Promise<any> ? T : Promise<T>

export interface IpcRenderer {
  send: <Key extends IpcMainOnEvent>(
    channel: Key,
    ...args: Parameters<IpcMainOnEventType[Key]>
  ) => void
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
  off: <Key extends IpcRendererOnEvent>(
    channel: Key,
    listener: (
      event: Electron.IpcRendererEvent,
      ...args: Parameters<IpcRendererOnEventType[Key]>
    ) => void
  ) => Electron.IpcRenderer
}
