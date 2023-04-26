import { ipcMainHandle, ipcMainRemove } from '@main/utils/ipc-main'
import { defaultAdbPath, getDeviceUuid, isDefaultAdbExists } from './utils'
import { $$, $ } from '@main/utils/shell'
import { parseArguments } from '@main/utils/arguments'

export function useEmulatorHooks(adapter: Promise<EmulatorAdapter>): void {
  ipcMainHandle('main.DeviceDetector:getEmulators', async event => {
    return (await adapter).getEmulators()
  })

  ipcMainHandle('main.DeviceDetector:getAdbDevices', async event => {
    return (await adapter).getAdbDevices()
  })
  ipcMainHandle(
    'main.DeviceDetector:getDeviceUuid',
    async (event, address, adbPath) => getDeviceUuid(address, adbPath)
  )

  ipcMainHandle('main.DeviceDetector:getAdbPath', event => {
    return defaultAdbPath
  })
  ipcMainHandle(
    'main.DeviceDetector:startEmulator',
    async (event, path: string) => {
      const args = parseArguments(path)
      // eslint-disable-next-line
      await $$(args.splice(0, 1)[0], args)
    }
  )

  ipcMainHandle(
    'main.DeviceDetector:startEmulator2',
    async (event, path: string) => {
      // eslint-disable-next-line
      await $`${path}`
    }
  )

  ipcMainHandle('main.DeviceDetector:isDefaultAdbExists', event => {
    return isDefaultAdbExists()
  })
}

export function removeEmulatorHooks(): void {
  ipcMainRemove('main.DeviceDetector:getEmulators')
  ipcMainRemove('main.DeviceDetector:getAdbDevices')
}
