import Store from 'electron-store';
import { ipcMain } from 'electron';
import { copyFileSync, rmSync } from 'fs';
import { StorageType } from './index.d';
import configuration from './configuration';
import defaults from './storage.default';

const schema = {
  configuration,
};

class Storage {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static get storage() {
    if (!Storage.singleton) {
      try {
        Storage.InitStorage();
      } catch (ex) {
        // TODO: 打印error到日志
        console.error(ex);
        const old = new Store();
        copyFileSync(old.path, `${old.path}.backup`);
        rmSync(old.path);
        Storage.InitStorage(true);
        Storage.reset = true;
      }
    }
    return Storage.singleton;
  }

  private static InitStorage(force = false) {
    Storage.singleton = new Store<StorageType>({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      schema, // FIXME: TypeError?
      defaults,
      clearInvalidConfig: force,
    });
    Storage.RegisterIpcMain();
  }

  private static RegisterIpcMain() {
    if (Storage.singleton) {
      ipcMain.on('electron-store-get', async (event, key) => {
        event.returnValue = Storage.singleton?.get(key);
      });
      ipcMain.on('electron-store-set', async (event, key, val) => {
        try {
          Storage.singleton?.set(key, val);
        } catch (ex) {
          // TODO: 打印error到日志
          console.error(`storage.set(${key}, ${JSON.stringify(val)})`);
          console.error(ex);
          event.reply(
            'electron-store-set-error',
            '你的设置将不会被保存，请验证设置是否正确'
          );
        }
      });
      ipcMain.on('electron-store-has', async (event, key) => {
        event.returnValue = Storage.singleton?.has(key);
      });
      ipcMain.on('electron-store-reset', async (event) => {
        event.returnValue = Storage.reset;
      });
    }
  }

  private static singleton?: Store<StorageType>;

  private static reset: boolean = false;
}

export default Storage.storage;
