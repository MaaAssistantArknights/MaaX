/* eslint-disable no-underscore-dangle */
import Store from 'electron-store';
import { copyFileSync, rmSync } from 'fs';
import Ajv from 'ajv';
import AjvErrors from 'ajv-errors';
import _ from 'lodash';
import { StorageType } from '../../common/@types/storage';
import defaults from './storage.default';

import configuration from './configuration';
import task from './task';

export const schema = {
  type: 'object',
  required: ['configuration', 'task'],
  properties: {
    configuration,
    task,
  },
  additionalProperties: false,
};

class Storage {
  private constructor() {
    try {
      Storage.InitStorage();
    } catch (ex) {
      // TODO: 打印fatal error到日志
      console.error(ex);
      const old = new Store();
      copyFileSync(old.path, `${old.path}.backup`);
      rmSync(old.path);
      Storage.InitStorage();
      Storage.error_ = '已重置';
    }
  }

  static get storage() {
    return Storage.singleton;
  }

  static get ajv() {
    return Storage.ajv_;
  }

  static get error() {
    return Storage.error_;
  }

  private static InitStorage() {
    const validator = Storage.ajv.compile(schema);

    if (!validator(Storage.singleton.store)) {
      Storage.error_ = '需要修复';
      validator.errors?.forEach((err) => {
        const path = _.trim(err.instancePath.replaceAll('/', '.'), '.');
        switch (err.keyword) {
          case 'required': {
            const prop = `${path}.${err.params.missingProperty}`;
            Storage.singleton.set(prop, _.get(defaults, prop));
            break;
          }
          default: {
            Storage.singleton.set(path, _.get(defaults, path));
            break;
          }
        }
      });
      Storage.error_ = '已修复';
    }
  }

  private static singleton: Store<StorageType> = new Store<StorageType>({
    defaults,
  });

  private static ajv_: Ajv = AjvErrors(
    new Ajv({ allErrors: true, removeAdditional: true, coerceTypes: true }),
    {
      keepErrors: false,
    }
  );

  public static error_: string | false = false;
}

export default Storage.storage;

export const { ajv, error } = Storage;
