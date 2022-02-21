import { nativeTheme, BrowserWindow } from "electron"
import { setVibrancy, BrowserWindow as AcrylicBrowserWindow } from "electron-acrylic-window"
import { is } from "electron-util"

export default function useTheme(window: BrowserWindow) {
  const event = () => {
    const isDark = nativeTheme.shouldUseDarkColors
    window.webContents.send("theme:update", isDark ? "maa-dark" : "maa-light")
    if (is.windows) {
      setVibrancy(window as AcrylicBrowserWindow, {
        theme: isDark ? "dark" : "light",
        effect: "blur",
      })
    }
  }
  window.webContents.on("did-finish-load", event)
  nativeTheme.on("updated", event)
}
