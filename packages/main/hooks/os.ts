import { ipcMain } from "electron";

export default function useOsHooks() {
  ipcMain.on("os:arch", (event) => {
    let arch = "NoArch";
    switch (process.arch) {
      case "x64":
        arch = "x64";
        break;
      case "arm64":
        arch = "arm64";
        break;
    }
    event.returnValue = arch;
  });

  ipcMain.on("os:platform", (event) => {
    let platform = "NoPlatform";
    switch (process.platform) {
      case "win32":
        platform = "windows";
        break;
      case "darwin":
        platform = "macos";
        break;
      case "linux":
        platform = "linux";
        break;
    }
    event.returnValue = platform;
  });
}