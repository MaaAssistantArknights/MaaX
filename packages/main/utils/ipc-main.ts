import { ipcMain } from 'electron'
import logger from '@main/utils/logger'

/**
 * 添加 ipc 调用的处理事件
 */
export const ipcMainHandle = <T>(event: IpcMainEvent<T>): void => {
  ipcMain.handle(event.name, async (e, ...args: any[]) => {
    logger.debug(`触发ipcMain事件${event.name}`)
    return await event.listener(e, ...args)
  })
}
