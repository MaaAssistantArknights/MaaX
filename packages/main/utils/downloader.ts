import ApiService from '@common/api/ApiService'
import fs from 'fs'
import path from 'path'
import logger from '@main/utils/logger'

interface IDownloadFile {
  url: string
  fileName?: string
  path: string
  displayName?: string
}

const service = new ApiService()

export async function downloadFile (file: IDownloadFile) {
  const { data, headers } = await service.instance.get(file.url, { responseType: 'stream' })

  let receivedBytes = 0
  const totalBytes = Number.parseInt(headers['content-length'])

  const filename = file.fileName ?? path.basename(new URL(file.url).pathname)
  const filepath = path.join(file.path, filename)
  const writer = fs.createWriteStream(filepath)
  data.on('data', (chunk) => {
    receivedBytes += chunk.length
    logger.debug(`receivedBytes: ${receivedBytes}`)
  })
  data.pipe(writer)
  return await new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}
