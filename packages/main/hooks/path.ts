import { app, ipcMain } from 'electron'
import { Assistant } from './interface'

type PathName = 'home' | 'appData' | 'userData' | 'cache' | 'temp' | 'exe' | 'module' | 'desktop' | 'documents' | 'downloads' | 'music' | 'pictures' | 'videos' | 'recent' | 'logs' | 'crashDumps'

export default function usePathHooks () {
  ipcMain.handle('path:app', async (event, name: PathName) => {
    return app.getPath(name)
  })

  ipcMain.handle('path:asst', async (event) => {
    return Assistant.libPath
  })
}
