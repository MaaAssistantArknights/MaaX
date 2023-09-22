import { Singleton } from '@common/function/singletonDecorator'
import { $ } from '@main/utils/shell'
import type { Device, Emulator, EmulatorAdapter } from '@type/device'
import psList from 'ps-list'

import { defaultAdbPath, getDeviceUuid, parseAdbDevice } from '../utils'

@Singleton
class LinuxEmulator implements EmulatorAdapter {
  protected async getBluestack(): Promise<void> {}

  protected async getNox(): Promise<void> {}

  protected async getMumu(): Promise<void> {}

  protected async getLd(): Promise<void> {}

  async getAdbDevices(): Promise<Device[]> {
    const { stdout } = await $`${defaultAdbPath} devices`
    const devices = parseAdbDevice(stdout)
    return Promise.all(
      devices.map(async d => {
        const uuid = await getDeviceUuid(d.address, defaultAdbPath)
        return { ...d, uuid: uuid || '' }
      })
    )
  }

  async getEmulators(): Promise<Emulator[]> {
    const emulator: Emulator[] = []
    const processes = await psList()
    processes.forEach(process => console.log(process))
    return emulator
  }
}

export default new LinuxEmulator()
