import { app } from 'electron'

import type { BrowserWindow } from 'electron'

import path from 'path'
import fs from 'fs'

import WindowManager from '@main/windowManager'
import ComponentInstaller from '@main/componentManager/componentInstaller'
import CoreInstaller from '@main/componentManager/installers/core'
import { Singleton } from '@common/function/singletonDecorator'

@Singleton
class DownloaderManager {
  constructor() {
    // initialize variables
    this.window_ = new WindowManager().getWindow()
    this.tasks_ = {
      "Maa Bundle": {
        state: 'interrupted',
        paused: false,
        progress: {
          prevReceivedBytes: 0,
          receivedBytes: 0
        }
      },
      "Maa Core": {
        state: 'interrupted',
        paused: false,
        progress: {
          prevReceivedBytes: 0,
          receivedBytes: 0
        }
      },
      "Maa Resource": {
        state: 'interrupted',
        paused: false,
        progress: {
          prevReceivedBytes: 0,
          receivedBytes: 0
        }
      },
      "Maa Dependency": {
        state: 'interrupted',
        paused: false,
        progress: {
          prevReceivedBytes: 0,
          receivedBytes: 0
        }
      },
      "Android Platform Tools": {
        state: 'interrupted',
        paused: false,
        progress: {
          prevReceivedBytes: 0,
          receivedBytes: 0
        }
      },
    }
    this.installers_ = {
      'Maa Core': new CoreInstaller()
    }
    // register hook
    this.window_.webContents.session.on('will-download', this.handleWillDownload)
  }

  public downloadComponent(component: ComponentType) {
    this.will_download_ = component
  }

  // 用于应对强制关闭
  public pauseDownload(component: ComponentType) {
    this.tasks_[component]._sourceItem?.pause()
  }

  // 用于应对强制关闭
  public cancelDownload(component: ComponentType) {
    this.tasks_[component]._sourceItem?.cancel()
  }

  private handleWillDownload(event: Electron.Event, item: Electron.DownloadItem) {
    const component = this.will_download_
    if (!component) {
      event.preventDefault()
      return
    }

    this.tasks_[component] = {
      state: item.getState(),
      startTime: item.getStartTime() * 1000,
      speed: 0,
      progress: {
        totalBytes: item.getTotalBytes(),
        receivedBytes: 0,
        prevReceivedBytes: 0,
        precent: 0,
      },
      paused: item.isPaused(),
      _sourceItem: item
    }
    // 将文件存储到this.download_path
    item.setSavePath(this.download_path)
    
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

  private handleDownloadUpdate(event: Electron.Event, state: "interrupted" | "progressing", item: Electron.DownloadItem, component: ComponentType) {
    const receivedBytes = item.getReceivedBytes()
    const totalBytes = item.getTotalBytes()

    this.tasks_[component].state = state
    this.tasks_[component].speed = receivedBytes - this.tasks_[component].progress.prevReceivedBytes
    this.tasks_[component].progress.receivedBytes = receivedBytes
    this.tasks_[component].progress.prevReceivedBytes = receivedBytes
    this.tasks_[component].progress.totalBytes = item.getTotalBytes()
    this.tasks_[component].progress.precent = totalBytes ? (receivedBytes / totalBytes) : undefined
    this.tasks_[component].paused = item.isPaused()

    // TODO: 通知对应的ComponentInstaller
    const installer = this.installers_[component]
    if (installer) {

    }
  }
  // TODO: interrupted后删除文件，并通知对应的ComponentInstaller
  private handleDownloadInterrupted(event: Electron.Event, item: Electron.DownloadItem, component: ComponentType) {

  }

  // TODO: 通知对应的ComponentInstaller
  private handleDownloadCompleted(event: Electron.Event, item: Electron.DownloadItem, component: ComponentType) {

  }

  private window_: BrowserWindow
  private tasks_: { [component in ComponentType]: DownloadTask }
  private readonly installers_: { [component in ComponentType]?: ComponentInstaller }
  private will_download_?: ComponentType
  private readonly download_path = path.join(app.getPath('appData'), app.getName(), 'download')
}

export default DownloaderManager