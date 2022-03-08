import type { BrowserWindow } from "electron";
import { ipcMain } from "electron";

export default function useController(window: BrowserWindow) {
  ipcMain.on("window:close", () => {
    if (window.isClosable()) {
      window.close();
    }
  });

  ipcMain.on("window:toggle-maximized", (event) => {
    if (!window.isMaximized() && window.isMaximizable()) {
      window.maximize();
      event.returnValue = true;
    } else if (window.isMaximized()) {
      window.unmaximize();
      event.returnValue = false;
    } else {
      event.returnValue = new Error("window is not maximizable");
    }
  });

  ipcMain.on("window:minimize", (event) => {
    if (window.isMinimizable()) {
      window.minimize();
      event.returnValue = true;
    }
  });

  ipcMain.on("window:is-maximized", (event) => {
    event.returnValue = window.isMaximized();
  });

  window.on("maximize", () => {
    window.webContents.send("window:update-maximized", window.isMaximized());
  });

  window.on("unmaximize", () => {
    window.webContents.send("window:update-maximized", window.isMaximized());
  });
}
