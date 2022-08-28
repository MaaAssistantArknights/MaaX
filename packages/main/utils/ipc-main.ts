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
    logger.silly(`Receive ipcMain event: ${eventName}`)
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
  logger.silly(`Send ipcRenderer event: ${eventName}`)
  win.webContents.send(eventName, ...args)
}
