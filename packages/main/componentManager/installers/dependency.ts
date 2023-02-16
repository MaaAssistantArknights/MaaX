// https://dl.google.com/android/repository/platform-tools-latest-windows.zip
import { Singleton } from '@common/function/singletonDecorator'
import ComponentInstaller from '../componentInstaller'
import DownloadManager from '@main/downloadManager'
import { ipcMainSend } from '@main/utils/ipc-main'
import logger from '@main/utils/logger'
import path from 'path'
import { getArch, getDownloadUrlSuffix, getPlatform } from '@main/utils/os'
import fs from 'fs'
import { getAppBaseDir } from '@main/utils/path'

@Singleton
class DependencyInstaller extends ComponentInstaller {
  public constructor () {
    super()
  }

  public async install (): Promise<void> {
    try {
      if (this.downloader_) {
        const update = await this.checkUpdate()
        if (typeof update === 'boolean' /* && update === false */) {
          logger.error('[Component Installer] Failed to check update')
          this.onException()
          return
        }
        if (!update) {
          logger.info('[Component Installer] No update available')
          this.onCompleted()
          return
        }
        this.downloader_?.downloadComponent(update.url, this.componentType)
        this.status_ = 'downloading'
      }
    } catch (e) {
      logger.error(e)
    }
  }

  public get status (): InstallerStatus {
    return this.status_
  }

  protected onStart (): void {

  }

  protected onProgress (progress: number): void {
    ipcMainSend('renderer.ComponentManager:updateStatus', {
      type: this.componentType,
      status: this.status_,
      progress
    })
  }

  protected onCompleted (): void {
    this.status_ = 'done'

    if (fs.existsSync(this.versionFile)) {
      fs.rmSync(this.versionFile)
    }
    fs.renameSync(this.upgradableFile, this.versionFile)

    ipcMainSend('renderer.ComponentManager:installDone', {
      type: this.componentType,
      status: this.status_,
      progress: 0 // 不显示进度条
    })
  }

  protected onException (): void {
    this.status_ = 'exception'
    ipcMainSend('renderer.ComponentManager:installInterrupted', {
      type: this.componentType,
      status: this.status_,
      progress: 0
    })
  }

  public readonly downloadHandle = {
    handleDownloadUpdate: (task: DownloadTask) => {
      this.onProgress(0.8 * (task.progress.precent ?? 0))
    },
    handleDownloadCompleted: (task: DownloadTask) => {
      this.status_ = 'unzipping'
      this.onProgress(0.8)
      this.unzipFile(task.savePath, path.join(getAppBaseDir(), 'core'))
    },
    handleDownloadInterrupted: () => {
      this.status_ = 'exception'
      this.onException()
    }
  }

  public readonly unzipHandle = {
    handleUnzipUpdate: (percent: number) => {
      this.onProgress(0.8 * percent * 0.2)
    },
    handleUnzipCompleted: () => {
      this.status_ = 'done'
      this.onCompleted()
    },
    handleUnzipInterrupted: () => {
      this.status_ = 'exception'
      this.onException()
    }
  }

  public async checkUpdate (): Promise<Update | false | undefined> {
    const platform = getPlatform()
    if (platform === 'macos') {
      return false
    }
    let release = null
    try {
      release = await this.getRelease()
    } catch (e: any) {
      logger.error(
        '[Component Installer] Failed to get latest release: ' +
        `${String(e.response.status)} ${String(e.response.statusText)}`
      )
      return false
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { assets, tag_name, published_at } = release
    const suffix = getDownloadUrlSuffix()
    const currentVersion = fs.existsSync(this.versionFile) ? fs.readFileSync(this.versionFile, 'utf-8') : ''
    if (currentVersion === tag_name) {
      return undefined
    }
    fs.writeFileSync(this.upgradableFile, tag_name, 'utf-8')
    const regexp = RegExp(`MAAComponent-Dependency-v(.+)${suffix}.zip`, 'g')
    const dependency = assets.find((asset: any) => regexp.test(asset.name))
    if (!dependency) {
      logger.error('[Component Installer] Failed to find dependency')
      return false
    }
    return {
      url: dependency.browser_download_url,
      version: tag_name,
      releaseDate: published_at
    }
  }

  protected status_: InstallerStatus = 'pending'
  public downloader_: DownloadManager | null = null

  private readonly versionFile = path.join(getAppBaseDir(), 'core/dep_version')
  private readonly upgradableFile = path.join(getAppBaseDir(), 'core/dep_upgradable')
  protected readonly componentType: ComponentType = 'Maa Dependency'
}

export default DependencyInstaller
