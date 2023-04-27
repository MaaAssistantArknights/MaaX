import { Singleton } from '@common/function/singletonDecorator'
import ComponentInstaller from '../componentInstaller'
import DownloadManager from '@main/downloadManager'
import { ipcMainSend } from '@main/utils/ipc-main'
import logger from '@main/utils/logger'
import path from 'path'
import fs from 'fs'
import { getAppBaseDir } from '@main/utils/path'
import { getDownloadUrlSuffix } from '@main/utils/os'
import CoreLoader from '@main/coreLoader'
import type { ComponentType, Update } from '@type/componentManager'
import type { DownloadTask } from '@type/downloadManager'
import type { InstallerStatus } from '@type/misc'

@Singleton
class CoreInstaller extends ComponentInstaller {
  public constructor() {
    super()
  }

  public async install(): Promise<void> {
    try {
      if (this.downloader_) {
        const update = await this.checkUpdate()
        if (typeof update === 'boolean' && !update) {
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

  public async upgrade(): Promise<void> {
    try {
      if (this.downloader_) {
        const update = await this.checkUpdate()
        if (typeof update === 'boolean' && !update) {
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

  public get status(): InstallerStatus {
    return this.status_
  }

  protected onStart(): void {}

  protected onProgress(progress: number): void {
    ipcMainSend('renderer.ComponentManager:updateStatus', {
      type: this.componentType,
      status: this.status_,
      progress,
    })
  }

  protected onCompleted(): void {
    this.status_ = 'done'
    if (fs.existsSync(this.versionFile)) {
      fs.rmSync(this.versionFile)
    }
    fs.renameSync(this.upgradableFile, this.versionFile)
    ipcMainSend('renderer.ComponentManager:installDone', {
      type: this.componentType,
      status: this.status_,
      progress: 0, // 不显示进度条
    })
  }

  protected onException(): void {
    this.status_ = 'exception'
    ipcMainSend('renderer.ComponentManager:installInterrupted', {
      type: this.componentType,
      status: this.status_,
      progress: 0,
    })
  }

  protected onDownloadedUpgrade(): void {
    ipcMainSend('renderer.ComponentManager:downloadUpgradeDone', {
      type: this.componentType,
      status: this.status_,
      progress: 0,
    })
  }

  public readonly downloadHandle = {
    handleDownloadUpdate: (task: DownloadTask) => {
      this.onProgress(0.8 * (task.progress.precent ?? 0))
    },
    handleDownloadCompleted: (task: DownloadTask) => {
      const coreVersion = new CoreLoader().GetCoreVersion()

      if (coreVersion) {
        // 存在core, 需要更新
        this.status_ = 'restart'
        this.onDownloadedUpgrade()
      } else {
        this.status_ = 'unzipping'
        this.onProgress(0.8)

        const src = task.savePath
        const dist = path.join(getAppBaseDir(), 'core')
        this.unzipFile(src, dist)
      }
    },
    handleDownloadInterrupted: () => {
      this.status_ = 'exception'
      this.onException()
    },
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
    },
  }

  public getRelease = async () => {
    const apiUrls = [
      'https://gh.cirno.xyz/api.github.com/repos/MaaAssistantArknights/MaaRelease/releases',
      'https://api.github.com/repos/MaaAssistantArknights/MaaRelease/releases',
    ]
    for (const url of apiUrls) {
      const releaseResponse = await this.tryRequest(url)
      if (releaseResponse) {
        this.releaseTemp = {
          data: releaseResponse.data[0],
          updated: Date.now(),
        }
        break
      }
    }
    return this.releaseTemp?.data
  }

  public async checkUpdate(): Promise<Update | false | undefined> {
    let release = null
    try {
      release = await this.getRelease()
    } catch (e: any) {
      logger.error(
        '[Component Installer] Failed to get latest release: ' +
          (e.response
            ? `${String(e.response.status)} ${String(e.response.statusText)}`
            : 'Request Timeout')
      )
      return false
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { assets, tag_name, published_at } = release
    const suffix = getDownloadUrlSuffix()
    const currentVersion = fs.existsSync(this.versionFile)
      ? fs.readFileSync(this.versionFile, 'utf-8')
      : ''
    if (currentVersion === tag_name) {
      return undefined
    }
    fs.writeFileSync(this.upgradableFile, tag_name, 'utf-8')
    // find ota
    const otaString = `MAAComponent-OTA-${currentVersion}_${
      tag_name as string
    }${suffix}.zip`
    logger.info(
      `[Component Installer | ${this.componentType}] Attempting to find OTA update asset: ${otaString}`
    )
    const otaExp = new RegExp(otaString, 'g')
    let download = assets.find((asset: any) => otaExp.test(asset.name))
    if (!download) {
      logger.warn(
        `[Component Installer | ${this.componentType}] ` +
          'Unable to acquire OTA update asset, attempting to obtain full update asset'
      )
      const fullExp = new RegExp(`MAA-v(.+)${suffix}.zip`, 'g')
      download = assets.find((asset: any) => fullExp.test(asset.name))
    }
    if (!download) {
      logger.error(
        `[Component Installer | ${this.componentType}] Failed to retrieve core update asset`
      )
      return false
    }
    logger.info(
      `[Component Installer | ${this.componentType}] Found update asset: ${
        tag_name as string
      }`
    )
    fs.writeFileSync(this.upgradeFile, download.name, 'utf-8')

    return {
      url: download.browser_download_url,
      version: tag_name,
      releaseDate: published_at,
    }
  }

  public getVersionFile() {
    return this.versionFile
  }

  protected status_: InstallerStatus = 'pending'
  public downloader_: DownloadManager | null = null

  // 当前版本
  private readonly versionFile = path.join(getAppBaseDir(), 'core/core_version')

  // 可升级版本
  private readonly upgradableFile = path.join(
    getAppBaseDir(),
    'core/core_upgradable'
  )

  // 升级文件名
  private readonly upgradeFile = path.join(getAppBaseDir(), 'core/core_upgrade')

  protected readonly componentType: ComponentType = 'Maa Core'
}

export default CoreInstaller
