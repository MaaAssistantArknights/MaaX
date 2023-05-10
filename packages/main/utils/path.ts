import { app, shell } from 'electron'
import path from 'path'

export const getAppBaseDir = (): string => path.join(app.getPath('appData'), app.getName())

export const openFolder = (type: 'core' | 'ui-log' | 'core-log'): void => {
  const baseAppDir = getAppBaseDir()
  if (type === 'core') {
    shell.openPath(path.join(baseAppDir, 'core'))
  } else if (type === 'ui-log') {
    shell.openPath(path.join(baseAppDir, 'logs'))
  } else if (type === 'core-log') {
    shell.openPath(path.join(baseAppDir, 'core', 'debug'))
  }
}
