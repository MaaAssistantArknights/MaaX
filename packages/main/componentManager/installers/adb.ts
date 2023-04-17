// https://dl.google.com/android/repository/platform-tools-latest-windows.zip
import { Singleton } from '@common/function/singletonDecorator'
import ComponentInstaller from '../componentInstaller'
import DownloadManager from '@main/downloadManager'
import { ipcMainSend } from '@main/utils/ipc-main'
import logger from '@main/utils/logger'
import path from 'path'
import { getAppBaseDir } from '@main/utils/path'
import { getPlatform } from '@main/utils/os'

@Singleton
class AdbInstaller extends ComponentInstaller {
  public constructor () {
    super()
  }

  public async install (): Promise<void> {
    try {
      if (this.downloader_) {
        const update = await this.checkUpdate()
        if (update) {
          this.downloader_?.downloadComponent(update.url, this.componentType)
          this.status_ = 'downloading'
        }
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

      const src = task.savePath
      this.unzipFile(src, path.join(getAppBaseDir()))
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
    if (platform === 'windows') {
      return {
        url: 'https://dl.google.com/android/repository/platform-tools-latest-windows.zip',
        version: 'latest',
        releaseDate: ''
      }
    } else if (platform === 'macos') {
      return {
        url: 'https://dl.google.com/android/repository/platform-tools-latest-darwin.zip',
        version: 'latest',
        releaseDate: ''
      }
    } else {
      return {
        url: 'https://dl.google.com/android/repository/platform-tools-latest-linux.zip',
        version: 'latest',
        releaseDate: ''
      }
    }
  }

  protected status_: InstallerStatus = 'pending'
  public downloader_: DownloadManager | null = null
  protected readonly componentType: ComponentType = 'Android Platform Tools'
}

export default AdbInstaller
