import { contextBridge, ipcRenderer } from "electron";
import { domReady } from "./utils";
import { useLoading } from "./loading";

const { appendLoading, removeLoading } = useLoading();

(async () => {
  await domReady();

  appendLoading();
})();

// --------- Expose some API to the Renderer process. ---------
const ipc = {
  on: (channel: IpcRendererHandleEvent, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void): Electron.IpcRenderer => {
    ipcRenderer.send('log:debug', `ipcRenderer event "${channel}" registered`)
    return ipcRenderer.on(channel, listener)
  },
  send: (channel: IpcMainHandleEvent, ...args: any[]): void => {
    ipcRenderer.send('log:debug', `ipcMain event "${channel}" sent`)
    ipcRenderer.send(channel, ...args)
  },
  invoke: (channel: IpcMainHandleEvent, ...args: any[]): Promise<any> => {
    ipcRenderer.send('log:debug', `ipcMain event "${channel}" invoked`)
    return ipcRenderer.invoke(channel, ...args)
  }
}

contextBridge.exposeInMainWorld("removeLoading", removeLoading);
contextBridge.exposeInMainWorld("ipcRenderer", withPrototype(ipc));

// `exposeInMainWorld` can't detect attributes and methods of `prototype`, manually patching it.
function withPrototype(obj: Record<string, any>) {
  const protos = Object.getPrototypeOf(obj);

  for (const [key, value] of Object.entries(protos)) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) continue;

    if (typeof value === "function") {
      // Some native APIs, like `NodeJS.EventEmitter['on']`, don't work in the Renderer process. Wrapping them into a function.
      obj[key] = function (...args: any) {
        return value.call(obj, ...args);
      };
    } else {
      obj[key] = value;
    }
  }
  return obj;
}
