import fs from 'fs'
import path from 'path'
import { manager } from '@main/utils/logger'
import { ipcMainHandle } from '@main/utils/ipc-main'
import { getAppBaseDir } from '@main/utils/path'

export default function useClearHooks (): void {
  ipcMainHandle('main.Util:GetCacheInfo', async (event) => {
    const info = {
      log: 0,
      download: 0
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
  })

  ipcMainHandle('main.Util:CleanLogs', async (event) => {
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
  })

  ipcMainHandle('main.Util:CleanDownloadCache', async (event) => {
    const downloadDir = path.join(getAppBaseDir(), 'download')
    const downloadFileNames = fs.readdirSync(downloadDir)

    for (const file of downloadFileNames) {
      const filepath = path.join(downloadDir, file)
      const stat = fs.statSync(filepath)
      if (stat.isFile()) {
        fs.rmSync(filepath)
      }
    }
  })
}
