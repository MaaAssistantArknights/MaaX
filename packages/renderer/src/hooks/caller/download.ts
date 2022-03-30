type DownloadItemState = 'progressing' | 'completed' | 'cancelled' | 'interrupted'

interface INewDownloadFile {
  url: string
  fileName?: string
  path: string
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
}

export default {
  getDownloadData: async () => await window.ipcRenderer.invoke('download:getDownloadData'),
  newDownloadFile: (file: INewDownloadFile) => window.ipcRenderer.send('download:newDownloadFile', file),
  retryDownloadFile: (file: IDownloadFile) => window.ipcRenderer.send('download:retryDownloadFile', file),
  togglePause: (file: IDownloadFile) => window.ipcRenderer.send('download:pauseOrResume', file)
}
