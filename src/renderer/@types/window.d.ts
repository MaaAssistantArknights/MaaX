/* eslint-disable @typescript-eslint/no-explicit-any */
// import { StorageType } from 'common/storage/index.d';

interface IpcRenderer {
  on: (channel: string, func: (...args: any[]) => void) => void;
  once: (channel: string, func: (...args: any[]) => void) => void;
  send: (channel: string, ...args: any[]) => void;
  sendSync: (channel: string, ...args: any[]) => any;
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
