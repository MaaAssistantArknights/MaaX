import Storage from '@main/storageManager'
import { ipcMainHandle } from '@main/utils/ipc-main'

const storage = new Storage()

export default function useStorageHooks (): void {
  ipcMainHandle('main.StorageManager:get', (event, key: string) => {
    return storage.get(key)
  })

  ipcMainHandle('main.StorageManager:set', (event, key: string, val: any) => {
    storage.set(key, val)
    return true
  })

  ipcMainHandle('main.StorageManager:has', (event, key: string) => {
    return storage.has(key)
  })
}
