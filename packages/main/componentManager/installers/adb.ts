import type { SourceMirror, UpdateStatus } from '../types'
import { Singleton } from '@common/function/singletonDecorator'
import { getPlatform } from '@main/utils/os'
import { createCheckUpdate, createVersionSaver } from '../utils/query'
import InstallerBase from '../installer'
import Storage from '@main/storageManager'

@Singleton
export default class AdbInstaller extends InstallerBase {
  checkUpdate: () => Promise<UpdateStatus>

  constructor() {
    super('Android Platform Tools', 'platform-tools')
    const platform = getPlatform()
    const platforSuffix = {
      windows: 'windows',
      macos: 'darwin',
      linux: 'linux',
      noPlatform: null,
    }[platform]

    const url = platforSuffix
      ? `https://dl.google.com/android/repository/platform-tools-latest-${platforSuffix}.zip`
      : null

    this.checkUpdate = createCheckUpdate(async now => {
      if (now) {
        return true // already latest
      } else if (url) {
        return {
          ver: 'latest',
          url: [url],
        }
      } else {
        return false
      }
    }, createVersionSaver(this.componentDir))
  }

  beforeExtractCheck() {
    return true
  }
}
