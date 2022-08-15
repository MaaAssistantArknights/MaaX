import DownloadManager from '@main/downloadManager'

interface DownloadHandle {
  handleDownloadUpdate: (task: DownloadTask) => void
  handleDownloadCompleted: (task: DownloadTask) => void
  handleDownloadInterrupted: (task: DownloadTask) => void
}

abstract class ComponentInstaller {
  public abstract install (): Promise<void>

  protected abstract checkUpdate (): Promise<string>
  protected abstract onStart (): void
  protected abstract onProgress (progress: number): void
  protected abstract onCompleted (): void
  protected abstract onException (): void
  public abstract readonly downloadHandle: DownloadHandle
  public abstract downloader_: DownloadManager | null
  protected static readonly UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36 Edg/97.0.1072.76'
}

export default ComponentInstaller
