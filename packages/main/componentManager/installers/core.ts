import _ from 'lodash'
import { app } from 'electron'

import { Singleton } from '@common/function/singletonDecorator'

import CoreLoader from '@main/coreLoader'
import { downloadFile } from '@main/utils/downloader'

import ComponentInstaller from '../componentInstaller'

const coreLoader = new CoreLoader()
@Singleton
class CoreInstaller extends ComponentInstaller {
  public async install (url: string): Promise<void> {
    const tempdir = app.getPath('temp')
    const coredir = coreLoader.libPath
    downloadFile({
      url,
      path: tempdir,
      displayName: 'MaaCore',
      onProgress: this.onProgress
    })
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
