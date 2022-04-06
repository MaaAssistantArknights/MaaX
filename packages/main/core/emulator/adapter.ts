abstract class EmulatorAdapter {
  protected abstract getBluestack (): Promise<Emulator>
  protected abstract getNox (): Promise<Emulator>
  protected abstract getMumu (): Promise<Emulator>
  protected abstract getLd (): Promise<Emulator>
  protected abstract getAdbDevices (): Promise<Emulator[]>

  abstract getEmulators (): Promise<Emulator[]>
}

export default EmulatorAdapter
