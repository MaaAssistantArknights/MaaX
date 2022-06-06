import { app, ipcMain } from 'electron'
import CoreLoader from '@main/coreLoader'
import path from 'path'
import { existsSync, mkdirSync } from 'fs'

type PathName =
  'home' |
  'appData' |
  'userData' |
  'cache' |
  'temp' |
  'exe' |
  'module' |
  'desktop' |
  'documents' |
  'downloads' |
  'music' |
  'pictures' |
  'videos' |
  'recent' |
  'logs' |
  'crashDumps'

export default function usePathHooks (): void {
  ipcMain.handle('path:app', async (event, name: PathName) => {
    return app.getPath(name)
  })

  ipcMain.handle('path:asst', async (event) => {
    return (new CoreLoader()).libPath
  })

  ipcMain.handle('path:adb', async (event) => {
    const dir = path.join(app.getPath('appData'), app.getName(), 'adb')
    if (existsSync(dir)) mkdirSync(dir)
    return dir
  })
}
