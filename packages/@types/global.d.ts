import type { MessageApiInjection } from 'naive-ui/lib/message/src/MessageProvider'
import type { DialogApiInjection } from 'naive-ui/lib/dialog/src/DialogProvider'
export { }

declare global {
  interface Window {
    // Expose some Api through preload script
    ipcRenderer: {
      on: (
        channel: IpcRendererHandleEvent,
        listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void
      ) => Electron.IpcRenderer
      send: (channel: IpcMainHandleEvent, ...args: any[]) => void
      invoke: (channel: IpcMainHandleEvent, ...args: any[]) => Promise<any>
      off: (
        channel: IpcRendererHandleEvent,
        listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void
      ) => Electron.IpcRenderer
    }
    removeLoading: () => void
    $message: MessageApiInjection
    $dialog: DialogApiInjection
    updateLoadingText: (text: string) => void
  }
}
