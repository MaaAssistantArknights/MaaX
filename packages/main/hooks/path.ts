import { app, ipcMain } from "electron";
import { Assistant } from "./interface";

type PathName = "home" | "appData" | "userData" | "cache" | "temp" | "exe" | "module" | "desktop" | "documents" | "downloads" | "music" | "pictures" | "videos" | "recent" | "logs" | "crashDumps";

export default function usePathHooks() {
  ipcMain.on("path:app", (event, name: PathName) => {
    event.returnValue = app.getPath(name);
  });

  ipcMain.on("path:asst", (event) => {
    event.returnValue = Assistant.libPath;
  });
}