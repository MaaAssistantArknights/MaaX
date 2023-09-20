import { manager } from '@main/utils/logger'
import { getAppBaseDir } from '@main/utils/path'
import { app } from 'electron'
import fs from 'fs'
import path from 'path'

export default function useClearHooks(): void {
  globalThis.main.Util = {
    GetCacheInfo() {
      const info = {
        log: 0,
        download: 0,
      }
      const logFileNames = fs.readdirSync(manager.logFileDir)
      for (const file of logFileNames) {
        const stat = fs.statSync(path.join(manager.logFileDir, file))
        if (stat.isFile()) {
          info.log += stat.size
        }
      }
      const downloadDir = path.join(getAppBaseDir(), 'download')
      const downloadFileNames = fs.readdirSync(downloadDir)

      for (const file of downloadFileNames) {
        const stat = fs.statSync(path.join(downloadDir, file))
        if (stat.isFile()) {
          info.download += stat.size
        }
      }
      return info
    },
    CleanLogs() {
      const logFileNames = fs.readdirSync(manager.logFileDir)
      for (const file of logFileNames) {
        const filepath = path.join(manager.logFileDir, file)
        if (filepath === manager.logFilePath) {
          continue
        }
        const stat = fs.statSync(filepath)
        if (stat.isFile()) {
          fs.rmSync(filepath)
        }
      }
    },
    CleanDownloadCache() {
      const downloadDir = path.join(getAppBaseDir(), 'download')
      const downloadFileNames = fs.readdirSync(downloadDir)

      for (const file of downloadFileNames) {
        const filepath = path.join(downloadDir, file)
        const stat = fs.statSync(filepath)
        if (stat.isFile()) {
          fs.rmSync(filepath)
        }
      }
    },
    RemoveAllConfig() {
      fs.writeFileSync(path.join(app.getPath('temp'), 'clearConfigToken'), '1')
      app.quit()
    },
  }
}
