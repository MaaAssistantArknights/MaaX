import type { MessageApiInjection } from 'naive-ui/lib/message/src/MessageProvider'
import type { DialogApiInjection } from 'naive-ui/lib/dialog/src/DialogProvider'
import type { IpcRenderer } from './ipc'

export {}

declare global {
  interface Window {
    // Expose some Api through preload script
    ipcRenderer: IpcRenderer
    removeLoading: () => void
    $message: MessageApiInjection
    $dialog: DialogApiInjection
    updateLoadingText: (text: string) => void
  }
}
