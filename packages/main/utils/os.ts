import SystemInformation from 'systeminformation'
import electron, { app } from 'electron'
import process from 'process'
import crypto from 'crypto'

import type { Arch, Platform } from '@type/api/maa'

export const getArch = (): Arch => {
  let arch: Arch = 'noArch'
  switch (process.arch) {
    case 'x64':
      arch = 'x64'
      break
    case 'arm64':
      arch = 'arm64'
      break
  }
  return arch
}

export const getPlatform = (): Platform => {
  let platform: Platform = 'noPlatform'
  switch (process.platform) {
    case 'win32':
      platform = 'windows'
      break
    case 'darwin':
      platform = 'macos'
      break
    case 'linux':
      platform = 'linux'
      break
  }
  return platform
}

export const getSystemInformation = async (): Promise<any> => {
  return await SystemInformation.getStaticData()
}

export const getDownloadUrlSuffix = (): string => {
  let ret = ''
  const platform = getPlatform()
  const arch = getArch()
  switch (platform) {
    case 'windows':
      ret = '-win-x64'
      break
    case 'macos':
      ret = '-macos-runtime-universal'
      break
    case 'linux':
      if (arch === 'x64') {
        ret = '-linux-x86_64'
      } else {
        ret = '-linux-aarch64'
      }
      break
  }
  return ret
}

export const getDownloadUrlExtension = (): string => {
  let ret = ''
  const platform = getPlatform()
  switch (platform) {
    case 'windows':
      ret = '.zip'
      break
    case 'macos':
      ret = '.zip'
      break
    case 'linux':
      ret = '.tar.gz'
      break
  }
  return ret
}

export const getDownloadQueryPlat = (): string => {
  let ret = ''
  const platform = getPlatform()
  switch (platform) {
    case 'windows':
      ret = 'win'
      break
    case 'macos':
      ret = 'mac'
      break
    case 'linux':
      ret = 'linux'
      break
  }
  return ret
}

export const isInDev = (): boolean => {
  // https://github.com/sindresorhus/electron-is-dev/blob/main/index.js
  const isEnvSet = 'ELECTRON_IS_DEV' in process.env
  const getFromEnv = Number.parseInt(process.env.ELECTRON_IS_DEV as string, 10) === 1
  return isEnvSet ? getFromEnv : !electron.app.isPackaged
}

export const reload = (): void => {
  app.quit()
  app.relaunch()
}

// Generate a random string for idempotent requests, penguin need this
export const generateIdempotentKey = (): string => {
  const tick = process.hrtime.bigint().toString().toUpperCase()
  const randomBuffer = new BigUint64Array(1)
  crypto.getRandomValues(randomBuffer)
  const rand = randomBuffer[0].toString(16).toUpperCase()
  return `MAAX${tick}${rand}`
}
