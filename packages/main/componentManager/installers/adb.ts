import type { UpdateStatus } from '../types'
import { Singleton } from '@common/function/singletonDecorator'
import { createFixedGetRelease } from '../utils/release'
import { getPlatform } from '@main/utils/os'
import { createCheckUpdate } from '../utils/update'
import InstallerBase from '../installer'

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

    const getRelease = createFixedGetRelease(url, `ADB-${platform}.zip`)

    this.checkUpdate = createCheckUpdate(
      getRelease,
      {
        OTA: () => 'NOT AVAILABLE',
        Full: () => new RegExp(`ADB-${platform}.zip`, 'g'),
      },
      this.componentType,
      this.componentDir
    )
  }

  beforeUnzipCheck() {
    return true
  }
}
