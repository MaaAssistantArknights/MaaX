import fs from 'fs'
import path from 'path'

import unzipper, { type Entry } from 'unzipper'

import logger from '@main/utils/logger'
import type { UnzipHandle } from '../types'

interface FileStatus {
  filename: string
  uncompressedSize: number
  compressedSize: number
  extractedSize: number
}

export function unzipFile(src: string, dist: string, handler: UnzipHandle) {
  const files: FileStatus[] = []

  fs.createReadStream(src)
    .pipe(unzipper.Extract({ path: dist }))
    .on('entry', (entry: Entry) => {
      const filename = path.join(dist, entry.path)
      const { type } = entry
      if (type === 'File') {
        files.push({
          filename,
          uncompressedSize: entry.extra.uncompressedSize,
          compressedSize: entry.extra.compressedSize,
          extractedSize: 0,
        })
        const writeStream = fs.createWriteStream(filename)
        writeStream.on('ready', () => {
          entry
            .on('data', (data: Uint8Array) => {
              writeStream.write(data, () => {
                const file = files.find(f => f.filename === filename)
                if (file) {
                  file.extractedSize += data.length
                  const extractedSize = files.reduce(
                    (acc, cur) => acc + cur.extractedSize,
                    0
                  )
                  const totalSize = files.reduce(
                    (acc, cur) => acc + cur.uncompressedSize,
                    0
                  )
                  handler.handleUnzipUpdate(extractedSize / totalSize)
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
        if (!fs.existsSync(filename)) {
          fs.mkdirSync(filename)
        }
      }
      entry.autodrain()
    })
    .on('finish', () => {
      handler.handleUnzipCompleted()
    })
    .on('error', error => {
      handler.handleUnzipInterrupted()
      logger.error(error)
    })
}
