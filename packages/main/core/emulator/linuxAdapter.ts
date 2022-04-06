import EmulatorAdapter from './adapter'
import psList from 'ps-list'
import { Singleton } from '@common/singleton'

@Singleton
class WindowsEmulator extends EmulatorAdapter {
  protected async getBluestack (): Promise<Emulator> {

  }

  protected async getNox (): Promise<Emulator> {

  }

  protected async getMumu (): Promise<Emulator> {

  }

  protected async getLd (): Promise<Emulator> {

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
