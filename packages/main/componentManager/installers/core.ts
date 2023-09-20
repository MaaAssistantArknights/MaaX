import type { SourceMirror, UpdateStatus } from '../types'
import { Singleton } from '@common/function/singletonDecorator'
import {
  getArch,
  getDownloadQueryPlat,
  getDownloadUrlExtension,
  getDownloadUrlSuffix,
} from '@main/utils/os'
import { tryRequest, createCheckUpdate, createVersionSaver } from '../utils/query'
import CoreLoader from '@main/coreLoader'
import InstallerBase from '../installer'
import Storage from '@main/storageManager'

@Singleton
export default class CoreInstaller extends InstallerBase {
  checkUpdate: () => Promise<UpdateStatus>

  constructor() {
    super('Maa Core', 'core')

    const plat = getDownloadQueryPlat()
    const arch = getArch()

    this.checkUpdate = createCheckUpdate(async now => {
      const res = await tryRequest(
        'https://release.maa-org.net/v1/release',
        {
          channel: 'stable',
          clientVersion: now ?? '',
          clientOs: plat ?? '',
          clientArch: arch,
        },
        this.componentType
      )
      if (!res) {
        return false
      }
      const result = JSON.parse(res.data)
      if (!result.data) {
        return true // alreadyLatest
      }
      return {
        ver: result.data.version,
        url: result.data.mirrors,
      }
    }, createVersionSaver(this.componentDir))
  }

  beforeExtractCheck() {
    const version = new CoreLoader().GetCoreVersion()
    return !version
  }
}
