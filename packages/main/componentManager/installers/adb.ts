// https://dl.google.com/android/repository/platform-tools-latest-windows.zip
import { app } from 'electron'
import { Singleton } from '@common/function/singletonDecorator'
import ComponentInstaller from '../componentInstaller'
import DownloadManager from '@main/downloadManager'
import { ipcMainSend } from '@main/utils/ipc-main'
import logger from '@main/utils/logger'
import path from 'path'

@Singleton
class AdbInstaller extends ComponentInstaller {
  public constructor () {
    super()
  }

  public async install (): Promise<void> {
    try {
      if (this.downloader_) {
        const downloadUrl = await this.checkUpdate()
        this.downloader_?.downloadComponent(downloadUrl, 'Android Platform Tools')
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
      type: 'Android Platform Tools',
      status: this.status_,
      progress
    })
  }

  protected onCompleted (): void {
    this.status_ = 'done'
    ipcMainSend('renderer.ComponentManager:installDone', {
      type: 'Android Platform Tools',
      status: this.status_,
      progress: 0 // 不显示进度条
    })
  }

  protected onException (): void {
    this.status_ = 'exception'
    ipcMainSend('renderer.ComponentManager:installInterrupted')
  }

  public readonly downloadHandle = {
    handleDownloadUpdate: (task: DownloadTask) => {
      this.onProgress(0.8 * (task.progress.precent ?? 0))
    },
    handleDownloadCompleted: (task: DownloadTask) => {
      this.status_ = 'unzipping'
      this.onProgress(0.8)

      const src = task.savePath
      this.unzipFile(src, path.join(app.getPath('appData'), app.getName()))
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

  protected async checkUpdate (): Promise<string> {
    return 'https://dl.google.com/android/repository/platform-tools-latest-windows.zip'
  }

  protected status_: InstallerStatus = 'pending'
  public downloader_: DownloadManager | null = null
}

export default AdbInstaller
