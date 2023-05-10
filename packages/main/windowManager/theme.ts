import { ipcMainHandle, ipcMainSend } from '@main/utils/ipc-main'
import { nativeTheme, BrowserWindow } from 'electron'
import { getPlatform } from '@main/utils/os'
import Storage from '@main/storageManager'

export default function useTheme(window: BrowserWindow): void {
  const themeEvent = (): void => {
    const isDark = nativeTheme.shouldUseDarkColors
    ipcMainSend('renderer.AppearanceManager:systemThemeUpdated', isDark ? 'maa-dark' : 'maa-light')
  }

  ipcMainHandle('main.AppearanceManager:themeUpdated', (event, isDark) => {
    const storage = new Storage()
    if (getPlatform() === 'windows' && storage.get('theme.acrylic')) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { setVibrancy } = require('electron-acrylic-window')
      setVibrancy(window, {
        theme: isDark ? 'dark' : 'light',
        effect: 'acrylic',
      })
    }
    if (getPlatform() === 'macos' && storage.get('theme.acrylic')) {
      window.setVibrancy(isDark ? 'dark' : 'light')
    }
  })

  ipcMainHandle('main.WindowManager:loaded', event => {
    themeEvent()
    ipcMainSend('renderer.WindowManager:loaded')
  })
  nativeTheme.on('updated', themeEvent)
}
