import { nativeTheme, BrowserWindow } from 'electron'
import { is } from 'electron-util'

export default function useTheme (window: BrowserWindow): void {
  const event = (): void => {
    const isDark = nativeTheme.shouldUseDarkColors
    window.webContents.send('theme:update', isDark ? 'maa-dark' : 'maa-light')
    if (is.windows) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { setVibrancy } = require('electron-acrylic-window')
      setVibrancy(window, {
        theme: isDark ? 'dark' : 'light',
        effect: 'acrylic'
      })
    }
  }
  window.webContents.on('did-finish-load', () => {
    event()
    window.webContents.send('ui:loaded')
  })
  nativeTheme.on('updated', event)
}
