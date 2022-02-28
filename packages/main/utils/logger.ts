import log from "electron-log";
import { is } from "electron-util";
import type { ElectronLog } from "electron-log";

class Logger {
  private constructor() {
    this._log = log.create("MeoAssistantArknights");
    const format = '{h}:{i}:{s}.{ms} [{level}] › {text}';
    this._log.transports.file.format = format;

    if (!is.development) {
      this._log.transports.console.level = false;
      this._log.transports.file.level = "info";
      this._log.transports.file.fileName = "ui.log";
    }
  }

  static instance = () => {
    if (!Logger._instance) {
      Logger._instance = new Logger();
    }
    return Logger._instance._log.functions;
  };

  private static _instance: Logger;
  private _log: ElectronLog;
}

export default Logger.instance();
