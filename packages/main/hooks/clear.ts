import { manager } from '@main/utils/logger'
import { getAppBaseDir } from '@main/utils/path'

import { app } from 'electron'
import fs from 'fs'
import path from 'path'

import type { ComponentType } from '@type/componentManager'
import { getComponentBaseDir } from '@main/componentManager/utils/path'
import { getComponentAdb } from '@main/componentManager/components/adb'
import { getComponentCore } from '@main/componentManager/components/core'
import CoreLoader from '@main/coreLoader'

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
    async removeComponent(component: ComponentType) {
      const sourceBaseDir = getComponentBaseDir()

      if (component === 'Android Platform Tools') {
        const adbComponent = await getComponentAdb()
        const adbSourceDir = path.join(sourceBaseDir, adbComponent.installer!.componentDir)

        fs.rmSync(adbSourceDir, { recursive: true })
      } else if (component === 'Maa Core') {
        const coreLoader = new CoreLoader()
        const coreStatus = coreLoader.loadStatus
        if (coreStatus) {
          coreLoader.dispose()
        }
        const coreComponent = await getComponentCore()
        const coreSourceDir = path.join(sourceBaseDir, coreComponent.installer!.componentDir)

        fs.rmSync(coreSourceDir, { recursive: true })
      }
    },
  }
}
