import fs from 'fs'
import path from 'path'
import tar from 'tar'
import unzipper from 'unzipper'

import logger from './logger'
import { getPlatform } from './os'

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
      // logger.debug(`[Extract Helper] create directory: ${dirpath}`)
      fs.mkdirSync(dirpath, { recursive: true })
    }
  }
  const platform = getPlatform()
  // 写入文件
  return Promise.all<void>(
    dir.files
      .filter(file => file.type === 'File')
      .map(
        file =>
          new Promise((resolve, reject) => {
            const dirpath = path.join(dest, path.dirname(file.path))
            if (!fs.existsSync(dirpath)) {
              // logger.debug(`[Extract Helper] create directory: ${dirpath}`)
              fs.mkdirSync(dirpath, { recursive: true })
            }
            // logger.debug(`[Extract Helper] create file: ${file.path}`)
            const destFilePath = path.join(dest, file.path)
            if (fs.existsSync(destFilePath)) {
              try {
                fs.accessSync(destFilePath, fs.constants.W_OK)
              } catch (e) {
                fs.unlinkSync(destFilePath)
                logger.info(`[Extract Helper] no write access, remove file: ${destFilePath}`)
              }
            }
            const writeStream = fs.createWriteStream(
              path.join(dest, file.path),
              platform === 'windows'
                ? undefined
                : {
                    mode: (file.externalFileAttributes >>> 16) & 0o777,
                  }
            )
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

export async function untarFile(src: string, dest: string) {
  await tar.x({
    file: src,
    cwd: dest,
  })
}

export async function extractFile(src: string, dest: string) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true })
  }
  logger.info(`extracting file: ${src} -> ${dest}`)

  if (src.endsWith('.zip')) {
    await unzipFile(src, dest)
  } else if (/\.tar(\.[gbx]z)?$/.test(src)) {
    await untarFile(src, dest)
  } else if (src.endsWith('tgz')) {
    await untarFile(src, dest)
  } else {
    logger.error('Unknown zipped file type')
  }
}
