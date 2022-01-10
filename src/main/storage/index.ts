import Store from 'electron-store';
import { ipcMain } from 'electron';
import { copyFileSync, rmSync } from 'fs';
import Ajv from 'ajv';
import AjvErrors from 'ajv-errors';
import _ from 'lodash';
import { StorageType } from './index.d';
import configuration from './configuration';
import defaults from './storage.default';

const schema = {
  type: 'object',
  required: ['configuration'],
  properties: {
    configuration,
  },
  additionalProperties: false,
};

class Storage {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static get storage() {
    if (!Storage.singleton) {
      try {
        Storage.InitStorage();
      } catch (ex) {
        // TODO: 打印fatal error到日志
        console.error(ex);
        const old = new Store();
        copyFileSync(old.path, `${old.path}.backup`);
        rmSync(old.path);
        Storage.InitStorage();
        Storage.error = '已重置';
      }
    }
    return Storage.singleton;
  }

  private static InitStorage() {
    const validator = Storage.ajv.compile(schema);
    Storage.singleton = new Store<StorageType>({
      defaults,
    });

    if (!validator(Storage.singleton.store)) {
      Storage.error = '需要修复';
      validator.errors?.forEach((err) => {
        const path = _.trim(err.instancePath.replaceAll('/', '.'), '.');
        switch (err.keyword) {
          case 'required': {
            const prop = `${path}.${err.params.missingProperty}`;
            Storage.singleton?.set(prop, _.get(defaults, prop));
            break;
          }
          default: {
            Storage.singleton?.set(path, _.get(defaults, path));
            break;
          }
        }
      });
      Storage.error = '已修复';
    }
    Storage.RegisterIpcMain();
  }

  private static RegisterIpcMain() {
    if (Storage.singleton) {
      ipcMain.on('electron-store-get', async (event, key) => {
        event.returnValue = Storage.singleton?.get(key);
      });
      ipcMain.on('electron-store-set', async (event, key, val) => {
        const backup = _.cloneDeep(Storage.singleton?.get(key));
        Storage.singleton?.set(key, val);
        const validator = Storage.ajv.compile(schema);
        if (!validator(Storage.singleton?.store)) {
          Storage.singleton?.set(key, backup);
          console.error(`storage.set(${key}, ${JSON.stringify(val)})`);
          event.reply(
            'electron-store-set-error',
            '你的设置将不会被保存，请验证设置是否正确'
          );
        }
      });
      ipcMain.on('electron-store-has', async (event, key) => {
        event.returnValue = Storage.singleton?.has(key);
      });
      ipcMain.on('electron-store-error', async (event) => {
        event.returnValue = Storage.error;
      });
    }
  }

  private static singleton?: Store<StorageType>;

  private static ajv: Ajv = AjvErrors(
    new Ajv({ allErrors: true, removeAdditional: true, coerceTypes: true }),
    {
      keepErrors: false,
    }
  );

  private static error: string | false = false;
}

export default Storage.storage;
