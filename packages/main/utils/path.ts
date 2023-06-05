import { MD5 } from 'crypto-js'
import { app, shell } from 'electron'
import fs from 'fs'
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

export const openExternal = (url: string) => {
  shell.openExternal(url)
}

export const saveTempJson = (data: string) => {
  const name = `${MD5(data)}.json`
  const tpath = path.join(app.getPath('temp'), 'maax')
  const rpath = path.join(tpath, name)
  fs.mkdirSync(tpath, { recursive: true })
  if (!fs.existsSync(rpath)) {
    fs.writeFileSync(rpath, data, 'utf8')
  }
  return rpath
}
