import { Singleton } from '@common/function/singletonDecorator'
import type { Device, Emulator, EmulatorAdapter } from '@type/device'
import type { Module } from '@type/misc'

import adapters from './adapters'
import { useEmulatorHooks } from './hooks'

@Singleton
class DeviceDetector implements Module {
  private readonly adapter: Promise<EmulatorAdapter>
  constructor() {
    this.adapter = adapters
    useEmulatorHooks(this.adapter)
  }

  public get name(): string {
    return 'DeviceDetector'
  }

  public get version(): string {
    return '1.0.0'
  }

  /**
   * @description 获取所有能识别到的模拟器信息
   * @returns {Promise<Emulator[]>}
   */
  public async getEmulators(): Promise<Emulator[]> {
    return await (await this.adapter).getEmulators()
  }

  /**
   * @description 获取通过执行`adb devices`得到的设备
   * @returns {Promise<Device[]>}
   */
  public async getAdbDevices(): Promise<Device[]> {
    return await (await this.adapter).getAdbDevices()
  }
}

export default DeviceDetector
