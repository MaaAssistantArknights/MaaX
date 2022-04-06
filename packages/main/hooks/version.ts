import { app, ipcMain } from 'electron'
import { Assistant } from '@main/core'

export default function useVersionHooks (): void {
  ipcMain.handle('version:ui', async (event) => {
    return app.getVersion()
  })

  ipcMain.handle('version:core', async (event) => {
    return Assistant.getInstance()?.GetVersion()
  })
}
