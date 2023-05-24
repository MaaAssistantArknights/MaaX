import path from 'path'

import DownloadManager from '@main/downloadManager'
import type { Installer, Notifier, SourceMirror, UpdateStatus } from './types'
import type { ComponentType } from '@type/componentManager'
import logger from '@main/utils/logger'
import { getAppBaseDir } from '@main/utils/path'
import { createNotifier } from './utils/notifier'
import type { InstallerStatus } from '@type/misc'
import { extractFile } from '@main/utils/extract'

export default abstract class InstallerBase implements Installer {
  public readonly componentType: ComponentType
  public readonly componentDir: string
  public abstract readonly sources: SourceMirror[]
  public status: InstallerStatus
  private notifier: Notifier

  abstract checkUpdate: () => Promise<UpdateStatus>
  abstract beforeExtractCheck(): boolean

  constructor(type: ComponentType, dir: string) {
    this.componentType = type
    this.componentDir = dir
    this.status = 'pending'
    this.notifier = createNotifier(this.componentType, this)
  }

  async install() {
    try {
      const info = await this.checkUpdate()
      switch (info.msg) {
        case 'failedAccessLatest':
          this.notifier.onException()
          return
        case 'alreadyLatest':
          logger.info(`[Component Installer | ${this.componentType}] No update available`)
          this.notifier.onCompleted()
          return
        case 'haveUpdate': {
          const dm = new DownloadManager()
          const { url, postUpgrade } = info.update

          dm.download(url, {
            handleDownloadUpdate: task => {
              this.notifier.onProgress(0.99 * (task.progress.percent ?? 0))
            },
            handleDownloadCompleted: task => {
              if (!this.beforeExtractCheck()) {
                // 没有提前卸载, 乐
                this.status = 'restart'
                this.notifier.onDownloadedUpgrade()
              } else {
                this.status = 'extracting'
                this.notifier.onProgress(0.99)

                extractFile(task.savePath, path.join(getAppBaseDir(), this.componentDir))
                  .then(() => {
                    this.status = 'done'
                    postUpgrade() // 更新版本信息
                    this.notifier.onCompleted()
                  })
                  .catch(() => {
                    this.status = 'exception'
                    this.notifier.onException()
                  })
              }
            },
            handleDownloadInterrupted: () => {
              this.status = 'exception'
              this.notifier.onException()
            },
          }).then(() => {
            this.status = 'downloading'
          })
        }
      }
    } catch (error) {
      logger.error(`[Component Installer | ${this.componentType}] Failed to install: ${error}`)
      this.status = 'exception'
      this.notifier.onException()
    }
  }
}
