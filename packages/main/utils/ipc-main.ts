/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { ipcMain, IpcMainInvokeEvent } from 'electron'
import WindowManager from '@main/windowManager'
import logger from '@main/utils/logger'

/**
 * 添加 ipc 调用的处理事件
 */
export function ipcMainHandle<Key extends IpcMainHandleEvent>(eventName: Key, listener: (event: IpcMainInvokeEvent, ...args: Parameters<IpcMainHandleEventType[Key]>) => ReturnType<IpcMainHandleEventType[Key]>): void {
  ipcMain.handle(eventName, (event, ...args) => {
    logger.silly(`Receive ipcMain event: ${eventName}`)
    return listener(event, ...(args as Parameters<IpcMainHandleEventType[Key]>))
  })
}

/**
 * 添加 ipc 消息的处理事件
 */
export function ipcMainOn<Key extends IpcMainOnEvent>(eventName: Key, listener: (event: IpcMainInvokeEvent, ...args: Parameters<IpcMainOnEventType[Key]>) => void): void {
  ipcMain.on(eventName, listener as (e: IpcMainInvokeEvent, ...as: any[]) => void)
}

export const ipcMainRemove = (eventName: IpcMainHandleEvent): void => {
  ipcMain.removeHandler(eventName)
}


export function ipcMainSend<Key extends IpcRendererOnEvent>(eventName: Key, ...args: Parameters<IpcRendererOnEventType[Key]>): void {
  const win = new WindowManager().getWindow()
  logger.silly(`Send ipcRenderer event: ${eventName}`)
  win.webContents.send(eventName, ...args)
}
