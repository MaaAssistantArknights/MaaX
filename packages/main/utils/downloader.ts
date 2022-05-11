import Downloader from 'nodejs-file-downloader'

interface IDownloadFile {
  url: string
  fileName?: string
  path: string
  displayName?: string
  onProgress: (percentage: number) => void
}

export async function downloadFile (file: IDownloadFile): Promise<void> {
  const downloader = new Downloader({
    url: file.url,
    directory: file.path,
    onProgress: (value) => file.onProgress(Number(value)),
    fileName: file.fileName
  })
  return await downloader.download()
}
