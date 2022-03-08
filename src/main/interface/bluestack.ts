import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

function bluestackPort(path: string | null): string | null {
  if (!path) return null;
  // eslint-disable-next-line no-param-reassign
  path = resolve(path);
  if (!existsSync(path)) {
    console.log('path not exist!');
    return null;
  }
  const conf = readFileSync(path, 'utf-8');
  const address = conf.match('bst.instance.Nougat64.status.adb_port="(\\w+)"');
  if (address != null) {
    return address[1];
  }
  console.log('no port in file');
  return null;
}

export default bluestackPort;
