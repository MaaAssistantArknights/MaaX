import fs from 'fs'
import path from 'path'
import unzipper from 'unzipper'

import logger from './logger'

export async function unzipFile(src: string, dest: string) {
  const dir = await unzipper.Open.file(src)

  // 如果压缩文件内存在唯一一个顶层文件夹, 则跳过这个文件夹
  let skipTopLevel = false
  if (dir.files.length > 1) {
    const topLevelDir = dir.files[0].path.split('/')[0]
    skipTopLevel = dir.files.every(file => file.path.startsWith(topLevelDir))
  }

  if (skipTopLevel) {
    for (const file of dir.files) {
      file.path = file.path.replace(/^[^/]+\//, '')
    }
  }

  // 先创建所有的文件夹
  for (const file of dir.files.filter(file => file.type === 'Directory')) {
    const dirpath = path.join(dest, file.path)
    if (!fs.existsSync(dirpath)) {
      fs.mkdirSync(dirpath)
    }
  }
  // 写入文件
  return Promise.all<void>(
    dir.files
      .filter(file => file.type === 'File')
      .map(
        file =>
          new Promise((resolve, reject) => {
            const writeStream = fs.createWriteStream(path.join(dest, file.path), {
              mode: (file.externalFileAttributes >>> 16) & 0o777,
            })
            writeStream.on('ready', () => {
              file
                .stream()
                .on('data', (data: Uint8Array) => {
                  writeStream.write(data)
                })
                .on('end', () => {
                  writeStream.end()
                  resolve()
                })
                .on('error', error => {
                  logger.error(error)
                  reject(error)
                })
            })
          })
      )
  )
}
