import { ipcMain, IpcMainEvent } from 'electron';

export const ipcMainOn = <T>(
  eventName: IPCEvents,
  listener: (event: IpcMainEvent, ...args: any[]) => Promise<T> | void | T
): void => {
  ipcMain.on(eventName, async (event, ...args: any[]) => {
    return listener(event, ...args);
  });
};

export const ipcMainOnce = <T>(
  eventName: IPCEvents,
  listener: (event: IpcMainEvent, ...args: any[]) => Promise<T> | void | T
): void => {
  ipcMain.once(eventName, async (event, ...args: any[]) => {
    return listener(event, ...args);
  });
};
