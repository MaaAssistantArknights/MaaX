import _ from 'lodash'
import { $, $$ } from '@main/utils/shell'
import logger from '@main/utils/logger'

export async function getDeviceUuid (address: string, adbPath = 'adb'): Promise<string | false> {
  if (!adbPath) {
    logger.error('adb_path is null')
    return false
  }
  if (!address) {
    logger.debug('address is null')
    return false
  }
  const connectResult = (await $$(adbPath, ['connect', address])).stdout
  if (connectResult.includes('connected')) {
    const ret = await $`"${adbPath}" -s ${address} shell settings get secure android_id`
    console.log(ret.stdout)
    if (ret) return _.trim(ret.stdout)
  }
  return false
}