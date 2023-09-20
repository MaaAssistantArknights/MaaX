import { Singleton } from '@main/../common/function/singletonDecorator'
import logger from '@main/utils/logger'
import { getAppBaseDir } from '@main/utils/path'
import WindowManager from '@main/windowManager'
import type { DownloadHandle, DownloadTask } from '@type/downloadManager'
import type { Module } from '@type/misc'
import type { BrowserWindow } from 'electron'
import fs from 'fs'
import path from 'path'

@Singleton
export default class DownloadManager implements Module {
  private readonly window: BrowserWindow
  private readonly download_path: string

  private pendingTaskHandler: DownloadHandle | null
  private pendingTaskResolve: (() => void)[]

  constructor() {
    this.window = new WindowManager().getWindow()
    this.download_path = path.join(getAppBaseDir(), 'download')
    this.pendingTaskHandler = null
    this.pendingTaskResolve = []

    if (!fs.existsSync(this.download_path)) {
      fs.mkdirSync(this.download_path)
    }

    this.window.webContents.session.on('will-download', (event, item) => {
      const handler = this.pendingTaskHandler
      if (!handler) {
        event.preventDefault()
        return
      }

      item.setSavePath(path.join(this.download_path, item.getFilename()))

      const task: DownloadTask = {
        state: item.getState(),
        startTime: item.getStartTime() * 1000,
        speed: 0,
        progress: {
          totalBytes: item.getTotalBytes(),
          receivedBytes: 0,
          prevReceivedBytes: 0,
          percent: 0,
        },
        paused: item.isPaused(),
        savePath: item.getSavePath(),
        _sourceItem: item,
      }

      if (fs.existsSync(item.getSavePath())) {
        // 看起来如果存在对应文件则直接视为下载完成
        handler.handleDownloadCompleted(task)
        this.pollNextDownload()
        event.preventDefault()
        return
      }

      item.on('updated', (event, state) => {
        const receivedBytes = item.getReceivedBytes()
        const totalBytes = item.getTotalBytes()

        task.state = state
        task.speed = receivedBytes - task.progress.prevReceivedBytes
        task.progress.receivedBytes = receivedBytes
        task.progress.prevReceivedBytes = receivedBytes
        task.progress.totalBytes = totalBytes
        task.progress.percent = totalBytes ? receivedBytes / totalBytes : undefined
        task.paused = item.isPaused()

        handler.handleDownloadUpdate(task)
      })

      item.on('done', (event, state) => {
        const receivedBytes = item.getReceivedBytes()
        task.progress.receivedBytes = receivedBytes
        task.state = state

        switch (state) {
          case 'completed':
            handler.handleDownloadCompleted(task)
            break
          case 'cancelled':
          case 'interrupted':
            if (fs.existsSync(item.getSavePath())) {
              fs.rmSync(item.getSavePath())
            }
            handler.handleDownloadInterrupted()
            break
        }
      })

      this.pollNextDownload()
    })
  }

  public get name(): string {
    return 'DownloadManager'
  }

  public get version(): string {
    return '1.0.0'
  }

  async download(url: string, handler: DownloadHandle): Promise<void> {
    if (this.pendingTaskHandler) {
      // 仍然有下载任务没有收到will-download
      await new Promise<void>(resolve => {
        this.pendingTaskResolve.push(resolve)
      })
    }
    this.pendingTaskHandler = handler
    logger.info(`Start downloading, url: ${url}`)
    this.window.webContents.downloadURL(url)
  }

  private pollNextDownload() {
    const res = this.pendingTaskResolve.shift()
    if (res) {
      res()
    } else {
      // 手动置空, 防止下一次download判定为还有下载任务未完成
      this.pendingTaskHandler = null
    }
  }
}
