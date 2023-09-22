import { getComponentBaseDir } from '@main/componentManager/utils/path'
import logger from '@main/utils/logger'
import { getPlatform } from '@main/utils/os'
import { $, $$ } from '@main/utils/shell'
import type { Device } from '@type/device'
import { app } from 'electron'
import fs from 'fs'
import _ from 'lodash'
import path from 'path'

const executableSuffix = getPlatform() === 'windows' ? '.exe' : ''

export const defaultAdbPath = path.join(
  getComponentBaseDir(),
  'platform-tools',
  `adb${executableSuffix}`
)

export function isDefaultAdbExists(): boolean {
  return fs.existsSync(defaultAdbPath)
}

export async function getDeviceUuid(
  address: string,
  adbPath = defaultAdbPath
): Promise<string | false> {
  if (!adbPath) {
    logger.error('adb_path is null')
    return false
  }
  if (!address) {
    logger.silly('address is null')
    return false
  }
  const connectResult = (await $$(adbPath, ['connect', address])).stdout
  if (connectResult.includes('connected')) {
    const ret = await $`"${adbPath}" -s ${address} shell settings get secure android_id`
    if (ret) return _.trim(ret.stdout)
  }
  return false
}

export function parseAdbDevice(stdout: string): Device[] {
  const lines = stdout.trim().split('\n')
  lines.shift()

  if (lines.length === 0) {
    return []
  }

  const connected = lines
    .map(line => {
      const [address, status] = line.split('\t')
      return { address, status }
    })
    .filter(({ status }) => status === 'device')

  return connected.map(({ address }) => ({
    uuid: '',
    address,
    status: 'available',
    adbPath: defaultAdbPath,
    config: 'General',
  }))
}
