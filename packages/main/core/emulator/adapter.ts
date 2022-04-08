abstract class EmulatorAdapter {
  protected abstract getBluestack (e: Emulator): Promise<void>
  protected abstract getNox (e: Emulator): Promise<void>
  protected abstract getMumu (e: Emulator): Promise<void>
  protected abstract getLd (e: Emulator): Promise<void>
  protected abstract getXY (e: Emulator): Promise<void>
  protected abstract getAdbDevices (): Promise<Emulator[]>

  abstract getEmulators (): Promise<Emulator[]>
}

export default EmulatorAdapter
