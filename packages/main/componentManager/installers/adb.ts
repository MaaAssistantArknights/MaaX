import type { SourceMirror, UpdateStatus } from '../types'
import { Singleton } from '@common/function/singletonDecorator'
import { createFixedGetRelease } from '../utils/release'
import { getPlatform } from '@main/utils/os'
import { createCheckUpdate } from '../utils/update'
import InstallerBase from '../installer'
import Storage from '@main/storageManager'

@Singleton
export default class AdbInstaller extends InstallerBase {
  public sources: SourceMirror[] = [
    {
      name: 'Google',
      urlReplacer: oldUrl => {
        return oldUrl
      },
    },
  ]

  checkUpdate: () => Promise<UpdateStatus>

  constructor() {
    super('Android Platform Tools', 'platform-tools')
    const storage = new Storage()
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
      this.componentDir,
      () =>
        this.sources.find(
          s => s.name === storage.get(['component', this.componentType, 'installMirror'])
        ) || this.sources[0]
    )
  }

  beforeExtractCheck() {
    return true
  }
}
