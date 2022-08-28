import { ipcMainHandle, ipcMainSend } from '@main/utils/ipc-main'
import { nativeTheme, BrowserWindow } from 'electron'
import { is } from 'electron-util'
import Storage from '@main/storageManager'

export default function useTheme (window: BrowserWindow): void {
  const themeEvent = (): void => {
    const isDark = nativeTheme.shouldUseDarkColors
    ipcMainSend('renderer.AppearanceManager:systemThemeUpdated', isDark ? 'maa-dark' : 'maa-light')
  }

  ipcMainHandle('main.AppearanceManager:themeUpdated', async (event, isDark) => {
    const storage = new Storage()
    if (is.windows && storage.get('theme.acrylic')) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { setVibrancy } = require('electron-acrylic-window')
      setVibrancy(window, {
        theme: isDark ? 'dark' : 'light',
        effect: 'acrylic'
      })
    }
  })

  ipcMainHandle('main.WindowManager:loaded', async (event) => {
    themeEvent()
    ipcMainSend('renderer.WindowManager:loaded')
  })
  nativeTheme.on('updated', themeEvent)
}
