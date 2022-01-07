import Store, { Schema } from 'electron-store';
import configurations from './configurations';
import defaults from './storage.default.json';

const schema: Schema<unknown> = {
  configurations: {
    type: 'object',
    properties: {
      ...configurations,
    },
  },
};

const storage = new Store({
  schema,
  defaults,
  clearInvalidConfig: true,
});

export default storage;
