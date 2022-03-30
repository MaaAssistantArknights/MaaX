import unzipper from 'unzipper'
import fs from 'fs'
import { ipcMain } from 'electron'
import path from 'path'
import logger from '@main/utils/logger'

export default function useUnzipHooks () {
  ipcMain.on('unzip:file', (event, src, dist) => {
    fs.createReadStream(src).pipe(unzipper.Extract({ path: dist }))
      .on('entry', (entry) => {
        const filename = path.join(dist, entry.path)
        const type = entry.type
        if (type === 'File') {
          entry.pipe(fs.createWriteStream(filename)).on('error', (e: unknown) => {
            logger.error(e)
          })
        } else if (type === 'Directory') {
          if (!fs.existsSync(filename)) { fs.mkdirSync(filename) }
        }
        entry.autodrain()
      })
      .on('finish', () => {
        event.reply('unzip:done')
        fs.rmSync(src)
      })
  })
}
