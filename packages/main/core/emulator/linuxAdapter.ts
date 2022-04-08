import EmulatorAdapter from './adapter'
import psList from 'ps-list'
import { Singleton } from '@common/singleton'

@Singleton
class WindowsEmulator extends EmulatorAdapter {
  protected async getBluestack (): Promise<void> {

  }

  protected async getNox (): Promise<void> {

  }

  protected async getMumu (): Promise<void> {

  }

  protected async getLd (): Promise<void> {

  }

  protected async getAdbDevices (): Promise<Emulator[]> {

  }

  async getEmulators (): Promise<Emulator[]> {
    const emulator: Emulator[] = []
    const processes = await psList()
    processes.forEach(process => console.log(process))
    return emulator
  }
}

export default new WindowsEmulator()
