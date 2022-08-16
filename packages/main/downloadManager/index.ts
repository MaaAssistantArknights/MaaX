import { app } from 'electron'

import type { BrowserWindow } from 'electron'

import path from 'path'
import fs from 'fs'

import WindowManager from '@main/windowManager'
import ComponentInstaller from '@main/componentManager/componentInstaller'
import CoreInstaller from '@main/componentManager/installers/core'
import { Singleton } from '@common/function/singletonDecorator'

@Singleton
class DownloadManager {
  constructor () {
    // initialize variables
    this.window_ = new WindowManager().getWindow()
    this.tasks_ = {
      'Maa App': {
        state: 'interrupted',
        paused: false,
        progress: {
          prevReceivedBytes: 0,
          receivedBytes: 0
        }
      },
      'Maa Core': {
        state: 'interrupted',
        paused: false,
        progress: {
          prevReceivedBytes: 0,
          receivedBytes: 0
        }
      },
      'Android Platform Tools': {
        state: 'interrupted',
        paused: false,
        progress: {
          prevReceivedBytes: 0,
          receivedBytes: 0
        }
      }
    }
    this.installers_ = {
      'Maa Core': new CoreInstaller()
    }

    for (const installer of Object.values(this.installers_)) {
      installer.downloader_ = this
    }
    if (!fs.existsSync(this.download_path)) {
      fs.mkdirSync(this.download_path)
    }
    // register hook
    this.window_.webContents.session.on('will-download', this.handleWillDownload)
  }

  public get name (): string {
    return 'DownloadManager'
  }

  public get version (): string {
    return '1.0.0'
  }

  public downloadComponent (url: string, component: ComponentType): void {
    this.will_download_ = component
    this.window_.webContents.downloadURL(url)
  }

  // 用于应对强制关闭
  public pauseDownload = (component: ComponentType): void => {
    this.tasks_[component]._sourceItem?.pause()
  }

  // 用于应对强制关闭
  public cancelDownload = (component: ComponentType): void => {
    this.tasks_[component]._sourceItem?.cancel()
  }

  private readonly handleWillDownload = (event: Electron.Event, item: Electron.DownloadItem): void => {
    const component = this.will_download_
    if (!component) {
      event.preventDefault()
      return
    }

    item.setSavePath(path.join(this.download_path, item.getFilename()))

    this.tasks_[component] = {
      state: item.getState(),
      startTime: item.getStartTime() * 1000,
      speed: 0,
      progress: {
        totalBytes: item.getTotalBytes(),
        receivedBytes: 0,
        prevReceivedBytes: 0,
        precent: 0
      },
      paused: item.isPaused(),
      savePath: item.getSavePath(),
      _sourceItem: item
    }

    // 将文件存储到this.download_path
    if (fs.existsSync(item.getSavePath())) {
      this.handleDownloadCompleted(event, item, component)
      this.will_download_ = undefined
      event.preventDefault()
      return
    }

    item.on('updated', (event, state) => {
      this.handleDownloadUpdate(event, state, item, component)
    })

    item.on('done', (event, state) => {
      const receivedBytes = item.getReceivedBytes()
      this.tasks_[component].progress.receivedBytes = receivedBytes
      this.tasks_[component].state = state

      switch (state) {
        case 'completed':
          this.handleDownloadCompleted(event, item, component)
          break
        case 'cancelled':
        case 'interrupted':
          this.handleDownloadInterrupted(event, item, component)
          break
      }
    })

    this.will_download_ = undefined
  }

  private readonly handleDownloadUpdate = (
    event: Electron.Event,
    state: 'interrupted' | 'progressing',
    item: Electron.DownloadItem,
    component: ComponentType
  ): void => {
    const receivedBytes = item.getReceivedBytes()
    const totalBytes = item.getTotalBytes()

    this.tasks_[component].state = state
    this.tasks_[component].speed = receivedBytes - this.tasks_[component].progress.prevReceivedBytes
    this.tasks_[component].progress.receivedBytes = receivedBytes
    this.tasks_[component].progress.prevReceivedBytes = receivedBytes
    this.tasks_[component].progress.totalBytes = totalBytes
    this.tasks_[component].progress.precent = totalBytes ? (receivedBytes / totalBytes) : undefined
    this.tasks_[component].paused = item.isPaused()

    const installer = this.installers_[component]
    if (installer) {
      installer.downloadHandle.handleDownloadUpdate(this.tasks_[component])
    }
  }

  private readonly handleDownloadInterrupted = (
    event: Electron.Event,
    item: Electron.DownloadItem,
    component: ComponentType
  ): void => {
    fs.rmSync(path.join(item.getSavePath(), item.getFilename()))
    const installer = this.installers_[component]
    if (installer) {
      installer.downloadHandle.handleDownloadInterrupted()
    }
  }

  private readonly handleDownloadCompleted = (
    event: Electron.Event,
    item: Electron.DownloadItem,
    component: ComponentType
  ): void => {
    // TODO: 通知对应的ComponentInstaller
    const installer = this.installers_[component]
    if (installer) {
      installer.downloadHandle.handleDownloadCompleted(this.tasks_[component])
    }
  }

  private tasks_: { [component in ComponentType]: DownloadTask }

  // 这个变量用于存储已经触发window_.webContents.downloadURL但是还未触发'will-download'事件的临时变量
  // 理论上downloadURL后会立刻触发'will-download'事件
  // 但是未验证在两句不同的downloadURL后的行为是否能够达到预期
  private will_download_?: ComponentType

  private readonly window_: BrowserWindow
  private readonly installers_: { [component in ComponentType]?: ComponentInstaller }
  private readonly download_path = path.join(app.getPath('appData'), app.getName(), 'download')
}

export default DownloadManager
