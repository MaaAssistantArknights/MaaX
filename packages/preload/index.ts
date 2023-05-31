import { contextBridge, ipcRenderer } from 'electron'
import { domReady } from './utils'
import { useLoading } from './loading'
import type { IpcMainHandleEvent, IpcRendererOnEvent } from '../types/ipc'

const { appendLoading, removeLoading } = useLoading()

;(async () => {
  await domReady()

  appendLoading()
})()

// --------- Expose some API to the Renderer process. ---------
const ipc = {
  on: (
    channel: IpcRendererOnEvent,
    listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void
  ): Electron.IpcRenderer => {
    ipcRenderer.send('main.Util:LogSilly', `ipcRenderer event "${channel}" registered`)
    return ipcRenderer.on(channel, listener)
  },
  invoke: (channel: IpcMainHandleEvent, ...args: any[]): Promise<any> => {
    ipcRenderer.send('main.Util:LogSilly', `ipcMain event "${channel}" invoked`)
    return ipcRenderer.invoke(channel, ...args)
  },
  off: (
    channel: IpcRendererOnEvent,
    listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void
  ): Electron.IpcRenderer => {
    ipcRenderer.send('main.Util:LogSilly', `ipcRenderer event "${channel}" unregistered`)
    return ipcRenderer.off(channel, listener)
  },
}

contextBridge.exposeInMainWorld('removeLoading', removeLoading)
contextBridge.exposeInMainWorld('ipcRenderer', withPrototype(ipc))

// `exposeInMainWorld` can't detect attributes and methods of `prototype`, manually patching it.
function withPrototype(obj: Record<string, any>) {
  const protos = Object.getPrototypeOf(obj)

  for (const [key, value] of Object.entries(protos)) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) continue

    if (typeof value === 'function') {
      // Some native APIs, like `NodeJS.EventEmitter['on']`, don't work in the Renderer process. Wrapping them into a function.
      obj[key] = function (...args: any) {
        return value.call(obj, ...args)
      }
    } else {
      obj[key] = value
    }
  }
  return obj
}
