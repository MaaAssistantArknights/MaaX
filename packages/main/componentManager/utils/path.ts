import Storage from '@main/storageManager'
import { getAppBaseDir } from '@main/utils/path'
import { getComponentAdb } from '../components/adb'
import { getComponentCore } from '../components/core'
import fs from 'fs'
import path from 'path'
import CoreLoader from '@main/coreLoader'

export function getComponentBaseDir() {
  const storage = new Storage()
  const componentDir = storage.get('setting.componentDir') as string | undefined
  return componentDir ?? getAppBaseDir()
}

export async function moveComponentBaseDir(dir: string) {
  const coreLoader = new CoreLoader()
  const coreStatus = coreLoader.loadStatus
  if (coreStatus) {
    coreLoader.dispose()
  }

  const storage = new Storage()
  const sourceBaseDir = getComponentBaseDir()
  const adbComponent = await getComponentAdb()
  const coreComponent = await getComponentCore()
  const adbSourceDir = path.join(sourceBaseDir, adbComponent.installer!.componentDir)
  const coreSourceDir = path.join(sourceBaseDir, coreComponent.installer!.componentDir)

  const adbTargetDir = path.join(dir, adbComponent.installer!.componentDir)
  const coreTargetDir = path.join(dir, coreComponent.installer!.componentDir)

  fs.mkdirSync(dir, { recursive: true })

  if (fs.existsSync(adbSourceDir)) {
    fs.renameSync(adbSourceDir, adbTargetDir)
  }
  if (fs.existsSync(coreSourceDir)) {
    fs.renameSync(coreSourceDir, coreTargetDir)
  }

  storage.set('setting.componentDir', dir)
}
