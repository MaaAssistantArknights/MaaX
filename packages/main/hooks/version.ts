import { app, ipcMain } from "electron";

export default function useVersionHooks() {
  ipcMain.on("version:ui", (event) => {
    event.returnValue = app.getVersion();
  });

  ipcMain.on("version:core", (event) => {
    event.returnValue = null;
  });
}
