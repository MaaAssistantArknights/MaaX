/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { ipcMain, type IpcMainInvokeEvent } from 'electron'
import WindowManager from '@main/windowManager'
import logger from '@main/utils/logger'
import type {
  IpcMainHandleEvent,
  IpcMainHandleEventType,
  IpcRendererOnEvent,
  IpcRendererOnEventType,
} from '@type/ipc'
import { createCalleeProxy, createCallerProxy } from '@type/ipc/utils'

/**
 * 添加 ipc 调用的处理事件
 */
function ipcMainHandle<Key extends IpcMainHandleEvent>(
  eventName: Key,
  listener: (
    event: IpcMainInvokeEvent,
    ...args: Parameters<IpcMainHandleEventType[Key]>
  ) => ReturnType<IpcMainHandleEventType[Key]>
): void {
  ipcMain.handle(eventName, (event, ...args) => {
    logger.silly(`Receive ipcMain event: ${eventName}`)
    return listener(event, ...(args as Parameters<IpcMainHandleEventType[Key]>))
  })
}

function ipcMainRemove(eventName: IpcMainHandleEvent): void {
  ipcMain.removeHandler(eventName)
}

function ipcMainSend<Key extends IpcRendererOnEvent>(
  eventName: Key,
  ...args: Parameters<IpcRendererOnEventType[Key]>
): void {
  const win = new WindowManager().getWindow()
  logger.silly(`Send ipcRenderer event: ${eventName}`)
  win.webContents.send(eventName, ...args)
}

export function setupProxy() {
  globalThis.renderer = createCallerProxy<IpcRendererOnEventType, 'renderer'>(
    'renderer',
    (key, ...args) => {
      ipcMainSend(key, ...args)
    }
  )

  globalThis.main = createCalleeProxy<IpcMainHandleEventType, 'main'>(
    'main',
    ipcMainHandle,
    ipcMainRemove
  )
}
