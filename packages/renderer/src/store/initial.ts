import storage from '@/hooks/caller/storage'
import { Store } from 'pinia'

import useDeviceStore, { DeviceState } from './devices'
import useSettingStore, { SettingState } from './settings'
import useTaskStore, { TaskState } from './tasks'
import useThemeStore, { ThemeState } from './theme'
import logger from '@/hooks/caller/logger'

type Patcher<T> = (storage: T) => T

export async function initialStore (): Promise<void> {
  const stores: Record<string, Store> = {
    device: useDeviceStore(),
    setting: useSettingStore(),
    tasks: useTaskStore(),
    theme: useThemeStore()
  }

  const patcher: Record<string, Patcher<any>> = {
    device: (storage: DeviceState) => {
      storage.devices = storage.devices.map((device) => ({
        ...device,
        status: 'unknown',
        connectionString: '',
        pid: ''
      }))
      return storage
    },
    setting: (storage: SettingState) => {
      return storage
    },
    tasks: (storage: TaskState) => {
      for (const tasks of Object.values(storage.deviceTasks)) {
        for (const task of tasks) {
          task.progress = 0
          task.startTime = undefined
          task.endTime = undefined
          task.status = 'idle'
        }
      }
      return storage
    },
    theme: (storage: ThemeState) => {
      return storage
    }
  }

  const promises = []

  for (const [storeId, store] of Object.entries(stores)) {
    promises.push(storage.get(storeId).then(s => {
      if (s) {
        store.$patch(patcher[storeId](s))
      }
    }))
  }

  Promise.all(promises).then(() => {
    console.log('finish loading store')
    window.ipcRenderer.invoke('main.WindowManager:loaded')
  })
}
