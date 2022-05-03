import { ipcMain } from 'electron'
import { getArch, getPlatform } from '@main/utils/os'

export default function useOsHooks (): void {
  ipcMain.handle('os:arch', async (event) => getArch())

  ipcMain.handle('os:platform', async (event) => getPlatform())
}
