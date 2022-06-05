import storage from '@/hooks/caller/storage'
import type { Store } from 'pinia'

import useDeviceStore, { DeviceState } from './devices'
import useSettingStore, { SettingState } from './settings'
import useTaskStore, { TaskState } from './tasks'
import useThemeStore, { ThemeState } from './theme'

type Patcher<T> = (state: T, storage: T) => void

export async function initialStore (): Promise<void> {
  const stores: Record<string, Store> = {
    device: useDeviceStore(),
    setting: useSettingStore(),
    tasks: useTaskStore(),
    theme: useThemeStore()
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
      for (const tasks of Object.values(storage.deviceTasks)) {
        for (const task of tasks) {
          task.progress = 0
          task.startTime = undefined
          task.endTime = undefined
          task.status = 'idle'
        }
      }
      state.deviceTasks = storage.deviceTasks
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
