import Storage from '@main/storageManager'

const storage = new Storage()

export default function useStorageHooks(): void {
  globalThis.main.StorageManager = {
    get(key) {
      return storage.get(key)
    },
    set(key, val) {
      storage.set(key, val)
      return true
    },
    has(key) {
      return storage.has(key)
    },
  }
}
