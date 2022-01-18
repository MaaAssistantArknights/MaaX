import { existsSync, readFileSync } from 'fs';

function bluestackPort(path: string): string | null {
  if (!existsSync(path)) {
    return null;
  }
  const conf = readFileSync(path, 'utf-8');
  const address = conf.match('bst.instance.Nougat64.status.adb_port="(\\w+)"');
  if (address != null) {
    return address[1];
  }
  return null;
}

export default bluestackPort;
