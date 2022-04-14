import { ipcMain } from 'electron'
import WindowManager from '@main/windowManager'

export default function useInstallerHooks (): void {
  const win = new WindowManager().getWindow()
}
