import { app, ipcMain } from 'electron'
import CoreLoader from '@main/coreLoader'

export default function useVersionHooks (): void {
  ipcMain.handle('version:ui', async (event) => {
    return app.getVersion()
  })

  ipcMain.handle('version:core', async (event) => {
    return (new CoreLoader()).GetVersion()
  })
}
