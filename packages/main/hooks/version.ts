import { app, ipcMain } from "electron";
import { Assistant } from "./interface";

export default function useVersionHooks() {
  ipcMain.handle("version:ui", async (event) => {
    return app.getVersion();
  });

  ipcMain.handle("version:core", async (event) => {
    return Assistant.getInstance()?.GetVersion();
  });
}
