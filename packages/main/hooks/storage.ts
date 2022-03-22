import { ipcMain } from "electron";
import storage from "@main/storage";

export default function useStorageHooks() {
  ipcMain.on("storage:get", async (event, key: string) => {
    event.returnValue = storage.get(key);
  });

  ipcMain.on("storage:set", async (event, key: string, val: any) => {
    storage.set(key, val);
  });

  ipcMain.on("storage:has", async (event, key: string) => {
    event.returnValue = storage.has(key);
  });
}
