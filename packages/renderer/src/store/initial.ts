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
      storage.devices = storage.devices.map((device) => (device.pid === undefined // 如果pid未定义则说明为手动输入，不刷新地址
        ? {
            ...device,
            status: 'unknown'
          }
        : {
            ...device,
            status: 'unknown',
            address: '',
            pid: ''
          }))
      return storage
    },
    setting: (storage: SettingState) => {
      return storage
    },
    tasks: (storage: TaskState) => {
      for (const taskGroups of Object.values(storage.deviceTasks)) {
        for (const taskGroup of taskGroups.groups) {
          for (const task of taskGroup.tasks) {
            task.task_id = -1
            task.progress = 0
            task.startTime = undefined
            task.endTime = undefined
            task.status = 'idle'
            task.results = {}
            task.showResult = false
          }
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
    logger.debug('finish loading store')
    window.ipcRenderer.invoke('main.WindowManager:loaded')
  })
}
