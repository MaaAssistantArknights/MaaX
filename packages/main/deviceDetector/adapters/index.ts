import { getPlatform } from '@main/utils/os'
import type { EmulatorAdapter } from '@type/device'

const getAdapter = async (): Promise<EmulatorAdapter> => {
  const platform = getPlatform()
  if (platform === 'windows') {
    return (await import('./winAdapter')).default
  } else if (platform === 'macos') {
    return (await import('./macAdapter')).default
  } else {
    return (await import('./linuxAdapter')).default
  }
}

export default (async () => {
  return await getAdapter()
})()
