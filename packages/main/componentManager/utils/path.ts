import Storage from '@main/storageManager'
import { getAppBaseDir } from '@main/utils/path'
import { getComponentAdb } from '../components/adb'
import { getComponentCore } from '../components/core'
import fs from 'fs'
import path from 'path'
import CoreLoader from '@main/coreLoader'
import _ from 'lodash'
import logger from '@main/utils/logger'

export function getComponentBaseDir() {
  const storage = new Storage()
  const componentDir = storage.get('setting.componentDir') as string

  return _.isEmpty(componentDir) ? getAppBaseDir() : componentDir
}

export async function moveComponentBaseDir(dir: string): Promise<boolean> {
  let withError = false
  const coreLoader = new CoreLoader()
  const coreStatus = coreLoader.loadStatus
  if (coreStatus) {
    coreLoader.dispose()
  }

  const sourceBaseDir = getComponentBaseDir()
  const adbComponent = await getComponentAdb()
  const coreComponent = await getComponentCore()
  const adbSourceDir = path.join(sourceBaseDir, adbComponent.installer!.componentDir)
  const coreSourceDir = path.join(sourceBaseDir, coreComponent.installer!.componentDir)

  const adbTargetDir = path.join(dir, adbComponent.installer!.componentDir)
  const coreTargetDir = path.join(dir, coreComponent.installer!.componentDir)

  fs.mkdirSync(dir, { recursive: true })

  if (fs.existsSync(adbSourceDir)) {
    await fs.promises.cp(adbSourceDir, adbTargetDir, { recursive: true })
    try {
      await fs.promises.rm(adbSourceDir, { recursive: true })
    } catch (e) {
      withError = true
      logger.error(e)
    }
  }
  if (fs.existsSync(coreSourceDir)) {
    await fs.promises.cp(coreSourceDir, coreTargetDir, { recursive: true })
    try {
      await fs.promises.rm(coreSourceDir, { recursive: true })
    } catch (e) {
      withError = true
      logger.error(e)
    }
  }
  return withError
}
