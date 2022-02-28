import { ipcMain } from "electron";
import logger from "../utils/logger";

export default function useLoggerHooks() {
  ipcMain.on("log:log", (event, ...params) => {
    logger.log(...params);
  });
  ipcMain.on("log:debug", (event, ...params) => {
    logger.debug(...params);
  });
  ipcMain.on("log:error", (event, ...params) => {
    logger.error(...params);
  });
  ipcMain.on("log:info", (event, ...params) => {
    logger.info(...params);
  });
  ipcMain.on("log:silly", (event, ...params) => {
    logger.silly(...params);
  });
  ipcMain.on("log:verbose", (event, ...params) => {
    logger.verbose(...params);
  });
  ipcMain.on("log:warn", (event, ...params) => {
    logger.warn(...params);
  });
}
