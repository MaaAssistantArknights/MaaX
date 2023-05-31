import { nativeTheme, BrowserWindow } from 'electron'
import { getPlatform } from '@main/utils/os'
import Storage from '@main/storageManager'

export default function useTheme(window: BrowserWindow): void {
  const themeEvent = (): void => {
    const isDark = nativeTheme.shouldUseDarkColors
    globalThis.renderer.AppearanceManager.systemThemeUpdated(isDark ? 'maa-dark' : 'maa-light')
  }

  globalThis.main.AppearanceManager = {
    themeUpdated(isDark) {
      const storage = new Storage()
      if (getPlatform() === 'windows') {
        window.setTitleBarOverlay({
          // 无法使用透明的WCO背景色，在反复hover的时候会导致错误的背景色叠加
          // https://www.electronjs.org/zh/docs/latest/tutorial/window-customization#%E5%B1%80%E9%99%90%E6%80%A7
          // https://github.com/electron/electron/issues/33567
          color: isDark ? '#0f0f0f' : '#f0f0f0',
          symbolColor: isDark ? '#ffffff' : '#000000',
        })
      }
      if (getPlatform() === 'windows' && storage.get('theme.acrylic')) {
        nativeTheme.themeSource = isDark ? 'dark' : 'light'
      }
      if (getPlatform() === 'macos' && storage.get('theme.acrylic')) {
        window.setVibrancy(isDark ? 'dark' : 'light')
      }
    },
    acrylicUpdated(isAcrylic) {
      if (getPlatform() === 'macos') {
        window.setVibrancy(isAcrylic ? 'under-window' : 'appearance-based')
      }
      if (getPlatform() === 'windows') {
        window.setBackgroundMaterial(isAcrylic ? 'mica' : 'auto')
      }
    },
  }

  globalThis.main.WindowManager.loaded = () => {
    themeEvent()
    globalThis.renderer.WindowManager.loaded()
  }

  nativeTheme.on('updated', themeEvent)
}
