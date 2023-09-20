import { getArch, getPlatform } from '@main/utils/os'
import type { Arch, Platform } from '@type/api/maa'
import type { UpdateStatus } from '../types'
import type { ComponentType } from '@type/componentManager'
import { existsSync, mkdirSync, readFile, readFileSync, writeFileSync } from 'fs'
import * as path from 'path'
import { getAppBaseDir } from '@main/utils/path'
import axios from 'axios'
import { getProxy } from './proxy'
import logger from '@main/utils/logger'

const MaxRetryTimes = 3

export async function tryRequest(
  url: string,
  params: Record<string, string>,
  component: ComponentType,
  retryCount = MaxRetryTimes
) {
  const proxy = await getProxy()
  for (let i = 0; i < retryCount; i++) {
    try {
      const response = await axios.get(url, {
        params,
        // adapter: require('axios/lib/adapters/http.js'),
        proxy,
      })
      return response
    } catch (error) {
      const errorText = `${error.code} | ${error.response?.status ?? ''} ${
        error.response?.statusText ?? ''
      }`
      logger.error(
        `[Component Installer | ${component}] Error request on URL: ${url}, attempts: ${
          i + 1
        }/${retryCount},  Error: ${errorText}\n${error.stack}`
      )
    }
  }
  return null
}

export function infoPathOf(componentDir: string) {
  const dir = path.join(getAppBaseDir(), componentDir)
  return {
    installRoot: dir,
    currentVersion: path.join(dir, 'version'),
    latestVersion: path.join(dir, 'upgradable'),
    // latestFile: path.join(dir, 'upgrade'),
  }
}

export function createVersionSaver(dir: string) {
  const infoPath = infoPathOf(dir)
  mkdirSync(infoPath.installRoot, {
    recursive: true,
  })

  return {
    get current() {
      return existsSync(infoPath.currentVersion)
        ? readFileSync(infoPath.currentVersion, 'utf-8')
        : null
    },
    set current(val: string | null) {
      if (val) {
        writeFileSync(infoPath.currentVersion, val)
      }
    },
    get latest() {
      return existsSync(infoPath.latestVersion)
        ? readFileSync(infoPath.latestVersion, 'utf-8')
        : null
    },
    set latest(val: string | null) {
      if (val) {
        writeFileSync(infoPath.latestVersion, val)
      }
    },
  }
}

export function createCheckUpdate(
  query: (now: string | null) => Promise<{ ver: string; url: string[] } | boolean>,
  version: { current: string | null; latest: string | null }
) {
  return async (): Promise<UpdateStatus> => {
    const info = await query(version.current)
    if (typeof info === 'boolean') {
      if (info) {
        return {
          msg: 'alreadyLatest',
        }
      } else {
        return {
          msg: 'failedAccessLatest',
        }
      }
    } else {
      version.latest = info.ver
      return {
        msg: 'haveUpdate',
        update: {
          ...info,
          post: () => {
            version.current = info.ver
          },
        },
      }
    }
  }
}
