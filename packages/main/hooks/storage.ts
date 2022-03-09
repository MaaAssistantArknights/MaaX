import { ipcMain } from "electron";
import _ from "lodash";
import ElectronStore from "electron-store";
import taskStorage from "../storage/tasks";

const storageCategoty = ["task"] as const;
type StorageCategory = typeof storageCategoty[number];
type StorageProxy = Record<StorageCategory, ElectronStore>;

export default function useStorageHooks() {
  const storageProxyHandler = {
    get: function (target: ElectronStore, property: string) {
      // console.log(target, property);
      return target.get(property);
    },
    set: function (target: ElectronStore, property: string, value: any) {
      // console.log(target, property, value);
      target.set(property, value);
      return true;
    },
    has: function (target: ElectronStore, property: string) {
      // console.log(target, property);
      return target.has(property);
    },
  };
  const storage = {
    // task: new Proxy(taskStorage, storageProxyHandler),
    task: taskStorage.store
  };

  ipcMain.on("storage:get", async (event, key: string) => {
    event.returnValue = _.get(storage, key);
  });

  ipcMain.on("storage:set", async (event, key: string, val: any) => {
    // const path = _.toPath(key);
    // if (storageCategoty.findIndex(v => v === path.at(0)) !== -1) {
    //   const item = storage[path.at(0) as StorageCategory];
    //   item.set(path.slice(1).join("."), val);
    // }
    _.set(storage, key, val);
  });

  ipcMain.on("storage:has", async (event, key: string) => {
    event.returnValue = _.has(storage, key);
  });
}
