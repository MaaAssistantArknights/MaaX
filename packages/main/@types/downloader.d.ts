type DownloadItemState =
  | 'progressing'
  | 'completed'
  | 'cancelled'
  | 'interrupted'
type IPCEventName =
  | 'openDownloadManager'
  | 'getDownloadData'
  | 'newDownloadFile'
  | 'retryDownloadFile'
  | 'openFileDialog'
  | 'openFile'
  | 'openFileInFolder'
  | 'initDownloadItem'
  | 'pauseOrResume'
  | 'removeDownloadItem'
  | 'clearDownloadDone'
  | 'newDownloadItem'
  | 'downloadItemUpdate'
  | 'downloadItemDone'
  | 'getDownloadPath'
  | 'getDownloadItemCount'

interface INewDownloadFile {
  url: string
  fileName?: string
  path: string
  displayName?: string
}

interface IDownloadFile {
  id: string
  url: string
  fileName: string
  path: string
  state: DownloadItemState
  startTime: number
  speed: number
  progress: number
  totalBytes: number
  receivedBytes: number
  paused: boolean
  displayName?: string
  _sourceItem?: import('electron').DownloadItem
}

interface IDownloadBytes {
  receivedBytes: number
  totalBytes: number
}

interface IPagination {
  pageIndex: number
  pageCount: number
}

interface IAddDownloadItem {
  item: import('electron').DownloadItem
  downloadIds: string[]
  data: IDownloadFile[]
  newDownloadItem: INewDownloadFile | null
}

interface IUpdateDownloadItem {
  item: import('electron').DownloadItem
  data: IDownloadFile[]
  downloadItem: IDownloadFile
  prevReceivedBytes: number
  state: DownloadItemState
}
