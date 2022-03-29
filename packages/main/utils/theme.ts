import { nativeTheme, BrowserWindow } from "electron";
import { is } from "electron-util";

export default function useTheme(window: BrowserWindow) {
  const event = () => {
    const isDark = nativeTheme.shouldUseDarkColors;
    window.webContents.send("theme:update", isDark ? "maa-dark" : "maa-light");
    if (is.windows) {
      const { setVibrancy } = require("electron-acrylic-window");
      setVibrancy(window, {
        theme: isDark ? "dark" : "light",
        effect: "acrylic",
      });
    }
  };
  window.webContents.on("did-finish-load", event);
  nativeTheme.on("updated", event);
}
