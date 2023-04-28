import path from 'path'

import DownloadManager from '@main/downloadManager'
import type { Installer, Notifier, UpdateStatus } from './types'
import type { ComponentType } from '@type/componentManager'
import logger from '@main/utils/logger'
import { getAppBaseDir } from '@main/utils/path'
import { createNotifier } from './utils/notifier'
import type { InstallerStatus } from '@type/misc'
import { unzipFile } from './utils/unzip'

export default abstract class InstallerBase implements Installer {
  public readonly componentType: ComponentType
  public readonly componentDir: string
  public status: InstallerStatus
  private notifier: Notifier

  abstract checkUpdate: () => Promise<UpdateStatus>
  abstract beforeUnzipCheck(): boolean

  constructor(type: ComponentType, dir: string) {
    this.componentType = type
    this.componentDir = dir

    this.status = 'pending'
    this.notifier = createNotifier(this.componentType, this)
  }

  async install() {
    const update = await this.checkUpdate()
    switch (update.msg) {
      case 'failedAccessLatest':
        this.notifier.onException()
        return
      case 'alreadyLatest':
        logger.info(
          `[Component Installer | ${this.componentType}] No update available`
        )
        this.notifier.onCompleted()
        return
      case 'haveUpdate': {
        const dm = new DownloadManager()
        dm.download(update.update.url, {
          handleDownloadUpdate: task => {
            this.notifier.onProgress(0.8 * (task.progress.precent ?? 0))
          },
          handleDownloadCompleted: task => {
            if (!this.beforeUnzipCheck()) {
              // 没有提前卸载, 乐
              this.status = 'restart'
              this.notifier.onDownloadedUpgrade()
            } else {
              this.status = 'unzipping'
              this.notifier.onProgress(0.8)

              unzipFile(
                task.savePath,
                path.join(getAppBaseDir(), this.componentDir),
                {
                  handleUnzipUpdate: percent => {
                    this.notifier.onProgress(0.8 + percent * 0.2)
                  },
                  handleUnzipCompleted: () => {
                    this.status = 'done'
                    update.update.postUpgrade() // 更新版本信息
                    this.notifier.onCompleted()
                  },
                  handleUnzipInterrupted: () => {
                    this.status = 'exception'
                    this.notifier.onException()
                  },
                }
              )
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
  }
}
