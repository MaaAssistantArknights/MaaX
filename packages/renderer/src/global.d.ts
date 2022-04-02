import type { MessageApiInjection } from 'naive-ui/lib/message/src/MessageProvider'
export {}

declare global {
  interface Window {
    // Expose some Api through preload script
    ipcRenderer: import('electron').IpcRenderer
    removeLoading: () => void
    $message: MessageApiInjection
  }
}
