import type { MessageApiInjection } from 'naive-ui/lib/message/src/MessageProvider'
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
    }
    removeLoading: () => void
    $message: MessageApiInjection
  }
}
