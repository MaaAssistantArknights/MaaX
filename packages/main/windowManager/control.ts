import type { BrowserWindow } from 'electron'
import { dialog } from 'electron'

export default function useController(window: BrowserWindow): void {
  globalThis.main.WindowManager = {
    toggleMaximized() {
      if (!window.isMaximized() && window.isMaximizable()) {
        window.maximize()
        return true
      } else if (window.isMaximized()) {
        window.unmaximize()
        return false
      } else {
        return new Error('window is not maximizable')
      }
    },
    minimize() {
      if (window.isMinimizable()) {
        window.minimize()
        return true
      } else {
        return false
      }
    },
    isMaximized() {
      return window.isMaximized()
    },
    async openDialog(title, properties, filters) {
      return await dialog.showOpenDialog(window, {
        title: title,
        properties: properties,
        filters: filters,
      })
    },
  }

  window.on('maximize', () => {
    globalThis.renderer.WindowManager.updateMaximized(window.isMaximized())
  })

  window.on('unmaximize', () => {
    globalThis.renderer.WindowManager.updateMaximized(window.isMaximized())
  })
}
