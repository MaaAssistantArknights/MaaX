import { ipcMainHandle, ipcMainRemove } from '@main/utils/ipc-main'
import { defaultAdbPath, getDeviceUuid } from './utils'
import { $$ } from '@main/utils/shell'
import yargs from 'yargs'

export function useEmulatorHooks (adapter: Promise<EmulatorAdapter>): void {
  ipcMainHandle('main.DeviceDetector:getEmulators',
    async (event): Promise<Emulator[]> => {
      return await (await adapter).getEmulators()
    }
  )

  ipcMainHandle('main.DeviceDetector:getAdbDevices',
    async (event): Promise<Device[]> => {
      return await (await adapter).getAdbDevices()
    }
  )
  ipcMainHandle('main.DeviceDetector:getDeviceUuid',
    async (event, address: string, adbPath?: string) => await getDeviceUuid(address, adbPath))
  ipcMainHandle('main.DeviceDetector:getAdbPath',
    async (event): Promise<string> => {
      return defaultAdbPath
    }
  )
  ipcMainHandle('main.DeviceDetector:startEmulator',
    async (event, path: string): Promise<void> => {
      const arg = yargs(path)
      // eslint-disable-next-line
      await $$(arg.argv._[0], Object.entries(arg.argv))
    })
}

export function removeEmulatorHooks (): void {
  ipcMainRemove('main.DeviceDetector:getEmulators')
  ipcMainRemove('main.DeviceDetector:getAdbDevices')
}
