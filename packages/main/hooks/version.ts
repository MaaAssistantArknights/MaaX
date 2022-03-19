import { app, ipcMain } from "electron";
import { Assistant } from "./interface";

export default function useVersionHooks() {
  ipcMain.on("version:ui", (event) => {
    event.returnValue = app.getVersion();
  });

  ipcMain.on("version:core", (event) => {
    event.returnValue = Assistant.getInstance()?.GetVersion();
  });
}
