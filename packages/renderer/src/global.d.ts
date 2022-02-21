
export { }

declare global {
  interface Window {
    // Expose some Api through preload script
    ipcRenderer: import('electron').IpcRenderer
    removeLoading: () => void
  }
}
