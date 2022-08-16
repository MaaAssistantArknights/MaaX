import unzipper, { Entry } from 'unzipper'
import fs from 'fs'
import path from 'path'
import logger from '@main/utils/logger'
import DownloadManager from '@main/downloadManager'

interface DownloadHandle {
  handleDownloadUpdate: (task: DownloadTask) => void
  handleDownloadCompleted: (task: DownloadTask) => void
  handleDownloadInterrupted: () => void
}

interface UnzipHandle {
  handleUnzipUpdate: (percent: number) => void
  handleUnzipCompleted: () => void
  handleUnzipInterrupted: () => void
}

abstract class ComponentInstaller {
  public abstract install (): Promise<void>

  protected abstract checkUpdate (): Promise<string>
  protected abstract onStart (): void
  protected abstract onProgress (progress: number): void
  protected abstract onCompleted (): void
  protected abstract onException (): void
  protected unzipFile = (src: string, dist: string): void => {
    const files: Array<{
      filename: string
      uncompressedSize: number
      compressedSize: number
      extractedSize: number
    }> = []
    fs.createReadStream(src).pipe(unzipper.Extract({ path: dist }))
      .on('entry', (entry: Entry) => {
        const filename = path.join(dist, entry.path)
        const { type } = entry
        if (type === 'File') {
          files.push({
            filename,
            uncompressedSize: entry.extra.uncompressedSize,
            compressedSize: entry.extra.compressedSize,
            extractedSize: 0
          })
          const writeStream = fs.createWriteStream(filename)
          writeStream.on('ready', () => {
            entry.on('data', (data: Uint8Array) => {
              writeStream.write(data, () => {
                const file = files.find(f => f.filename === filename)
                if (file) {
                  file.extractedSize += data.length
                  const extractedSize = files.reduce((acc, cur) => acc + cur.extractedSize, 0)
                  const totalSize = files.reduce((acc, cur) => acc + cur.uncompressedSize, 0)
                  this.unzipHandle.handleUnzipUpdate(extractedSize / totalSize)
                }
              })
            })
              .on('end', () => {
                writeStream.close()
              })
              .on('error', error => {
                logger.error(error)
                writeStream.close()
              })
          })
        } else if (type === 'Directory') {
          if (!fs.existsSync(filename)) { fs.mkdirSync(filename) }
        }
        entry.autodrain()
      })
      .on('finish', () => {
        this.unzipHandle.handleUnzipCompleted()
      })
      .on('error', error => {
        this.unzipHandle.handleUnzipInterrupted()
        logger.error(error)
      })
  }

  public abstract readonly downloadHandle: DownloadHandle
  public abstract readonly unzipHandle: UnzipHandle
  public abstract downloader_: DownloadManager | null
  protected static readonly UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36 Edg/97.0.1072.76'
}

export default ComponentInstaller
