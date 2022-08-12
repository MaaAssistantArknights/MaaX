import { ipcMainHandle, ipcMainRemove } from '@main/utils/ipc-main'
import { getDeviceUuid } from './utils'

export function useEmulatorHooks(adapter: Promise<EmulatorAdapter>): void {
  ipcMainHandle('main.DeviceDetector:getEmulators',
    async (event): Promise<Emulator[]> => {
      return await (await adapter).getEmulators()
    })

  ipcMainHandle('main.DeviceDetector:getAdbDevices',
    async (event): Promise<Device[]> => {
      return await (await adapter).getAdbDevices()
    })
  ipcMainHandle('main.deviceDetector:getDeviceUuid',
    async (event, address: string, adbPath?: string) => await getDeviceUuid(address, adbPath))
}

export function removeEmulatorHooks(): void {
  ipcMainRemove('main.DeviceDetector:getEmulators')
  ipcMainRemove('main.DeviceDetector:getAdbDevices')
}
