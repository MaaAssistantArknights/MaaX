import EmulatorAdapter from './adapterBase'
import psList from 'ps-list'
import { Singleton } from '@main/../common/function/singletonDecorator'

@Singleton
class MacEmulator extends EmulatorAdapter {
  protected async getBluestack (): Promise<Emulator> {

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

export default new MacEmulator()
