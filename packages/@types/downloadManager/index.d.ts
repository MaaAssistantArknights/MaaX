type DownloadTaskState =
  | 'progressing'
  | 'completed'
  | 'cancelled'
  | 'interrupted'

interface DownloadProgressInfo {
  precent?: number
  prevReceivedBytes: number
  receivedBytes: number
  totalBytes?: number
}

interface DownloadTask {
  state: DownloadTaskState
  startTime?: number
  speed?: number
  progress: DownloadProgressInfo
  paused: boolean
  savePath: string
  _sourceItem?: import('electron').DownloadItem
}
