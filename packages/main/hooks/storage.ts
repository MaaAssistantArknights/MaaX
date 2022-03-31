import { ipcMain } from 'electron'
import storage from '@main/storage'

export default function useStorageHooks (): void {
  ipcMain.handle('storage:get', async (event, key: string) => {
    return storage.get(key)
  })

  ipcMain.handle('storage:set', async (event, key: string, val: any) => {
    storage.set(key, val)
    return true
  })

  ipcMain.handle('storage:has', async (event, key: string) => {
    return storage.has(key)
  })
}
