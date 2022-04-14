import ComponentInstaller from '../componentInstaller'
import { Singleton } from '@common/function/singletonDecorator'

@Singleton
class CoreInstaller extends ComponentInstaller {
  public install (): void {

  }

  public get status (): InstallerStatus {
    return this.status_
  }

  protected onStart (): void {

  }

  protected onProgress (progress: number): void {

  }

  protected onCancel (): void {

  }

  protected status_: InstallerStatus = 'pending'
}

export default CoreInstaller
