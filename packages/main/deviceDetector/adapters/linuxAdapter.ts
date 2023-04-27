import psList from 'ps-list'
import { Singleton } from '@common/function/singletonDecorator'
import type { Device, Emulator, EmulatorAdapter } from '@type/device'

@Singleton
class LinuxEmulator implements EmulatorAdapter {
  protected async getBluestack(): Promise<void> {}

  protected async getNox(): Promise<void> {}

  protected async getMumu(): Promise<void> {}

  protected async getLd(): Promise<void> {}

  async getAdbDevices(): Promise<Device[]> {
    return []
  }

  async getEmulators(): Promise<Emulator[]> {
    const emulator: Emulator[] = []
    const processes = await psList()
    processes.forEach(process => console.log(process))
    return emulator
  }
}

export default new LinuxEmulator()
