import storage from '@/hooks/caller/storage'
import { type Store } from 'pinia'

import useDeviceStore, { type DeviceState } from './devices'
import useSettingStore, { type SettingState } from './settings'
import useTaskStore, { type TaskState } from './tasks'
import useThemeStore, { type ThemeState } from './theme'
import logger from '@/hooks/caller/logger'
import type { CoreTaskName, FrontTaskName } from '@type/task'

type Patcher<T> = (storage: T) => T

export async function initialStore(): Promise<void> {
  const stores: Record<string, Store> = {
    device: useDeviceStore(),
    setting: useSettingStore(),
    tasks: useTaskStore(),
    theme: useThemeStore(),
  }

  const patcher: Record<string, Patcher<any>> = {
    device: (storage: DeviceState) => {
      storage.devices = storage.devices.map(device => ({
        ...device,
        status: 'unknown',
        address: '',
        pid: '',
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
            task.name = (task.name.slice(0, 1).toUpperCase() + task.name.slice(1)) as
              | CoreTaskName
              | FrontTaskName
            if ((task.name as string) === 'Rogue') {
              task.name = 'Roguelike'
            }
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
    },
  }

  const promises = []

  for (const [storeId, store] of Object.entries(stores)) {
    promises.push(
      storage.get(storeId).then(s => {
        if (s) {
          store.$patch(patcher[storeId](s))
        }
      })
    )
  }

  Promise.all(promises).then(() => {
    logger.debug('finish loading store')
    window.ipcRenderer.invoke('main.WindowManager:loaded')
  })
}
