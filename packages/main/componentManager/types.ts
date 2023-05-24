import type { ComponentType, Update } from '@type/componentManager'
import type { DownloadHandle } from '@type/downloadManager'

export interface UnzipHandle {
  handleUnzipUpdate: (percent: number) => void
  handleUnzipCompleted: () => void
  handleUnzipInterrupted: () => void
}

export type UpdateStatus =
  | {
      msg: 'failedAccessLatest'
    }
  | {
      msg: 'alreadyLatest'
    }
  | {
      msg: 'haveUpdate'
      update: Update
    }

export interface Installer {
  readonly sources: SourceMirror[]
  readonly componentType: ComponentType
  readonly componentDir: string

  install(): Promise<void>
  checkUpdate(): Promise<UpdateStatus>
}

export interface ReleaseObject {
  tag_name: string
  published_at: string
  assets: {
    name: string
    browser_download_url: string
  }[]
}

export interface Notifier {
  onStart(): void
  onProgress(progress: number): void
  onCompleted(): void
  onDownloadedUpgrade(): void
  onException(): void
}

export interface SourceMirror {
  readonly name: string
  readonly urlReplacer: (oldUrl: string) => string
}
