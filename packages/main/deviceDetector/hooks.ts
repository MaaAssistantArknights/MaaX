import { parseArguments } from '@main/utils/arguments'
import { $, $$ } from '@main/utils/shell'
import type { EmulatorAdapter } from '@type/device'

import { defaultAdbPath, getDeviceUuid, isDefaultAdbExists } from './utils'

export function useEmulatorHooks(adapter: Promise<EmulatorAdapter>): void {
  globalThis.main.DeviceDetector = {
    async getEmulators() {
      return (await adapter).getEmulators()
    },
    async getAdbDevices() {
      return (await adapter).getAdbDevices()
    },
    async getDeviceUuid(address, adbPath) {
      return getDeviceUuid(address, adbPath)
    },
    getAdbPath() {
      return defaultAdbPath
    },
    async startEmulator(path) {
      const args = parseArguments(path)
      await $$(args.splice(0, 1)[0], args)
    },
    async startEmulator2(path) {
      await $`${path}`
    },
    isDefaultAdbExists,
  }
}

export function removeEmulatorHooks(): void {
  delete globalThis.main.DeviceDetector.getEmulators
  delete globalThis.main.DeviceDetector.getAdbDevices
}
