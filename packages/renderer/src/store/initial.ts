import logger from '@/hooks/caller/logger'
import storage from '@/hooks/caller/storage'
import type { CoreTaskName, FrontTaskName } from '@type/task'
import { type Store } from 'pinia'

import useComponentStore, { type ComponentStoreState } from './components'
import useDeviceStore, { type DeviceState } from './devices'
import useResourceStore, { type ResourceState } from './resource'
import useSettingStore, { type SettingState } from './settings'
import useTaskStore, { type TaskState } from './tasks'
import useThemeStore, { type ThemeState } from './theme'

type Patcher<T> = (storage: T) => T

export async function initialStore(): Promise<void> {
  const stores: Record<string, Store> = {
    device: useDeviceStore(),
    setting: useSettingStore(),
    tasks: useTaskStore(),
    theme: useThemeStore(),
    component: useComponentStore(),
    resource: useResourceStore(),
  }

  const patcher: Record<string, Patcher<any>> = {
    device: (storage: DeviceState) => {
      storage.devices = storage.devices.map(device => ({
        ...device,
        status: 'unknown',
        address: device.config === 'General' ? device.address : '', // General为手动创建连接的设备, 默认不重置地址
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
          taskGroup.tasks = taskGroup.tasks.filter(task => {
            task.name = (task.name.slice(0, 1).toUpperCase() + task.name.slice(1)) as
              | CoreTaskName
              | FrontTaskName
            if ((task.name as string) === 'Rogue') {
              task.name = 'Roguelike'
            }
            if ((task.name as string) === 'Idle') {
              return false // "delete" idle
            }
            task.progress = 0
            task.startTime = undefined
            task.endTime = undefined
            task.status = 'idle'
            task.results = {}
            task.showResult = false
            return true // keep the task
          })
        }
      }
      return storage
    },
    theme: (storage: ThemeState) => {
      return storage
    },
    component: (storage: ComponentStoreState) => {
      return storage
    },
    resource: (storage: ResourceState) => {
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
    window.main.WindowManager.loaded()
  })
}
