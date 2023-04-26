import type { MessageApiInjection } from 'naive-ui/lib/message/src/MessageProvider'
import type { DialogApiInjection } from 'naive-ui/lib/dialog/src/DialogProvider'
export {}

type __WrapPromise<T> = T extends Promise<any> ? T : Promise<T>

declare global {
  interface Window {
    // Expose some Api through preload script
    ipcRenderer: {
      send: <Key extends IpcMainOnEvent>(
        channel: Key,
        ...args: Parameters<IpcMainHandleEventType[Key]>
      ) => void
      invoke: <Key extends IpcMainHandleEvent>(
        channel: Key,
        ...args: Parameters<IpcMainHandleEventType[Key]>
      ) => __WrapPromise<ReturnType<IpcMainHandleEventType[Key]>>

      on: <Key extends IpcRendererOnEvent>(
        channel: Key,
        listener: (
          event: Electron.IpcRendererEvent,
          ...args: Parameters<IpcRendererOnEventType[Key]>
        ) => void
      ) => Electron.IpcRenderer
      off: <Key extends IpcRednererOnEvent>(
        channel: Key,
        listener: (
          event: Electron.IpcRendererEvent,
          ...args: Parameters<IpcRendererOnEventType[Key]>
        ) => void
      ) => Electron.IpcRenderer
    }
    removeLoading: () => void
    $message: MessageApiInjection
    $dialog: DialogApiInjection
    updateLoadingText: (text: string) => void
  }
}
