abstract class EmulatorAdapter {
  protected abstract getBluestack (pname: string, pid: string): Promise<Emulator>
  protected abstract getNox (pname: string, pid: string): Promise<Emulator>
  protected abstract getMumu (pname: string, pid: string): Promise<Emulator>
  protected abstract getLd (pname: string, pid: string): Promise<Emulator>
  protected abstract getAdbDevices (): Promise<Emulator[]>

  abstract getEmulators (): Promise<Emulator[]>
}

export default EmulatorAdapter
