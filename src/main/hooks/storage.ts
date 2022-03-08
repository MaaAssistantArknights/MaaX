import _ from 'lodash';
import { ipcMainOn } from '../../common/ipc-main';
import storage, { ajv, schema, error } from '../storage';

ipcMainOn('storage:get', async (event, key) => {
  event.returnValue = storage.get(key);
});

ipcMainOn('storage:set', async (event, key, val) => {
  const backup = _.cloneDeep(storage.get(key));
  storage.set(key, val);
  const validator = ajv.compile(schema);
  if (!validator(storage.store)) {
    storage.set(key, backup);
    console.error(`storage.set(${key}, ${JSON.stringify(val)})`);
    console.error(ajv.errorsText(validator.errors));
    event.reply('storage:error', '你的设置将不会被保存，请验证设置是否正确');
  }
});

ipcMainOn('storage:has', async (event, key) => {
  event.returnValue = storage.has(key);
});

ipcMainOn('storage:error', async (event) => {
  event.returnValue = error;
});
