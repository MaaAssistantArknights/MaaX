import ComponentInstaller from '../componentInstaller'
import { Singleton } from '@common/function/singletonDecorator'
import axios from 'axios'

@Singleton
class CoreInstaller extends ComponentInstaller {
  public install (): void {
    const os = {
      arch: process.arch,
      platform: process.platform
    }
  }

  public get status (): InstallerStatus {
    return this.status_
  }

  protected onStart (): void {

  }

  protected onProgress (progress: number): void {

  }

  protected onException (): void {

  }

  protected status_: InstallerStatus = 'pending'
}

export default CoreInstaller
