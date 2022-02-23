import type { BrowserWindowConstructorOptions, BrowserWindow } from "electron";
import { is } from "electron-util";

class WindowFactory {
  static create(options?: BrowserWindowConstructorOptions): BrowserWindow {
    const module = is.windows
      ? require("electron-acrylic-window")
      : require("electron");
    const Ctor = module.BrowserWindow;
    return new Ctor(options);
  }
}

export default WindowFactory;
