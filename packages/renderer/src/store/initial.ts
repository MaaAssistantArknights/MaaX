import storage from '@/hooks/caller/storage'
import type { Store } from 'pinia'

import type { DeviceState } from './devices'
import type { SettingState } from './settings'
import type { TaskState } from './tasks'
import type { ThemeState } from './theme'

type Patcher<T> = (state: T, storage: T) => void

export async function initialStore (): Promise<void> {
  const stores: Record<string, Store> = {
    device: (await import('./devices')).default(),
    setting: (await import('./settings')).default(),
    tasks: (await import('./tasks')).default(),
    theme: (await import('./theme')).default()
  }

  const patcher: Record<string, Patcher<any>> = {
    device: (state: DeviceState, storage: DeviceState) => {
      state.devices = storage.devices.map((device) => ({
        ...device,
        status: 'unknown',
        connectionString: '',
        pid: ''
      }))
    },
    setting: (state: SettingState, storage: SettingState) => {
      state = storage
    },
    tasks: (state: TaskState, storage: TaskState) => {
      Object.values(storage.deviceTasks).forEach(tasks => {
        tasks.forEach(task => {
          task.progress = 0
          task.startTime = undefined
          task.endTime = undefined
          task.status = 'idle'
        })
      })
      state = storage
    },
    theme: (state: ThemeState, storage: ThemeState) => {
      state = storage
    }
  }

  Object.entries(stores).forEach(async ([storeId, store]) => {
    const s = await storage.get(storeId)
    if (s) {
      store.$patch((state: any) => patcher[storeId](state, s))
    }
  })
}
