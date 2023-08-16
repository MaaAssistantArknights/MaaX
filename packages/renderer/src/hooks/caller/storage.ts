export default {
  get: async (key: string) => window.main.StorageManager.get(key),
  set: async (key: string, val: any) => await window.main.StorageManager.set(key, val),
  has: async (key: string) => await window.main.StorageManager.has(key),
}
