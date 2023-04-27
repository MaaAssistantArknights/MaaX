import type { DownloadItem } from 'electron'

export type DownloadTaskState =
  | 'progressing'
  | 'completed'
  | 'cancelled'
  | 'interrupted'

export interface DownloadProgressInfo {
  precent?: number
  prevReceivedBytes: number
  receivedBytes: number
  totalBytes?: number
}

export interface DownloadTask {
  state: DownloadTaskState
  startTime?: number
  speed?: number
  progress: DownloadProgressInfo
  paused: boolean
  savePath: string
  _sourceItem?: DownloadItem
}
