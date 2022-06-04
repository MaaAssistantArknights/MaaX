/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { ipcMain, IpcMainInvokeEvent } from 'electron'
import WindowManager from '@main/windowManager'
import logger from '@main/utils/logger'

/**
 * 添加 ipc 调用的处理事件
 */
export const ipcMainHandle = <T>(
  eventName: IpcMainHandleEvent,
  listener: (event: IpcMainInvokeEvent, ...args: any[]) => Promise<T> | void | T
): void => {
  ipcMain.handle(eventName, async (event, ...args: any[]) => {
    logger.debug(`触发ipcMain事件: ${eventName}`)
    return await listener(event, ...args)
  })
}

export const ipcMainRemove = (eventName: IpcMainHandleEvent): void => {
  ipcMain.removeHandler(eventName)
}

export const ipcMainSend = (
  eventName: IpcRendererHandleEvent,
  ...args: any[]
): void => {
  const win = new WindowManager().getWindow()
  if (win.webContents.listeners(eventName).length > 0) {
    logger.debug(`触发ipcRenderer事件: ${eventName}`)
    win.webContents.send(eventName, ...args)
  }
}
