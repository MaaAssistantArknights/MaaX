import type { Device } from './device'
import type { Emulator } from './emulator'

export interface EmulatorAdapter {
  // protected abstract getBluestack (e: Emulator): Promise<void>
  // protected abstract getNox (e: Emulator): Promise<void>
  // protected abstract getMumu (e: Emulator): Promise<void>
  // protected abstract getLd (e: Emulator): Promise<void>
  // protected abstract getXY (e: Emulator): Promise<void>
  getAdbDevices: () => Promise<Device[]>

  /**
   * @description Get all emulators
   * @returns {Promise<Emulator[]>}
   */
  getEmulators: () => Promise<Emulator[]>
}

// export default EmulatorAdapter
