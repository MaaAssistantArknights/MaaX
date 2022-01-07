interface IpcRenderer {
  on: (channel: string, func: (...args: unknown[]) => void) => void;
  once: (channel: string, func: (...args: unknown[]) => void) => void;
  send: (channel: string, ...args: unknown[]) => void;
}

interface Storage {
  get: (key: string) => any;
  set: (key: string, value: any) => void;
  has: (key: string) => boolean;
}

interface Window {
  $ipcRenderer: IpcRenderer;
  $storage: Storage;
}
