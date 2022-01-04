interface IpcRenderer {
  on: (channel: string, func: (...args: unknown[]) => void) => void;
  once: (channel: string, func: (...args: unknown[]) => void) => void;
  send: (channel: string, ...args: unknown[]) => void;
}

interface Electron {
  ipcRenderer: IpcRenderer;
}

interface Window {
  electron: Electron;
}
