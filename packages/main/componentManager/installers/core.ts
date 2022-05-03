import _ from 'lodash'
import { app } from 'electron'

import { Singleton } from '@common/function/singletonDecorator'
import { maa } from '@common/api'

import ui from '@main/utils/ui'
import { Assistant } from '@main/coreLoader'
import { getArch, getPlatform } from '@main/utils/os'
import { downloadFile } from '@main/utils/downloader'

import ComponentInstaller from '../componentInstaller'

const { message } = ui

@Singleton
class CoreInstaller extends ComponentInstaller {
  public async install (): Promise<void> {
    const os = {
      arch: getArch(),
      platform: getPlatform()
    }
    const currentVersion = Assistant.getInstance()?.GetVersion()
    const available = await maa.component.getInfo('MaaCore')
    if (_.isError(available)) {
      console.error(available)
      message('服务器睡着惹(￣o￣) . z Z，待会再试试吧', {
        type: 'error'
      })
      return
    }
    const supportedVersions =
      available.versions.filter(v =>
        v.support.findIndex(system =>
          system.arch === os.arch && system.platform === os.platform
        ) !== -1
      )
    if (supportedVersions.length === 0) {
      message('还不支持这个系统哦，再等等吧 (´Д｀ )', {
        type: 'error'
      })
      return
    }

    const getPackageInfo = async (): Promise<Error | {
      platform: Api.Maa.Platform
      arch: Api.Maa.Arch[]
      version: string
      url: string
      hash: string
    }> => {
      if (currentVersion) {
        return await maa.download.getDiffPackage(
          os.platform, os.arch, currentVersion, supportedVersions[0].version, 'MaaCore'
        )
      } else {
        return await maa.download.getCompletePackage(os.platform, os.arch, supportedVersions[0].version, 'MaaCore')
      }
    }
    const packageInfo = await getPackageInfo()
    if (_.isError(packageInfo)) {
      message('服务器睡着惹(￣o￣) . z Z，待会再试试吧', {
        type: 'error'
      })
      return
    }
    const tempdir = app.getPath('temp')
    const coredir = Assistant.libPath
    downloadFile({
      url: packageInfo.url,
      path: tempdir,
      displayName: 'MaaCore'
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
