import type EmulatorAdapter from './adapterBase'
import { is } from 'electron-util'

const getAdapter = async (): Promise<EmulatorAdapter> => {
  if (is.windows) {
    return (await import('./winAdapter')).default
  } else if (is.macos) {
    return (await import('./macAdapter')).default
  } else {
    return (await import('./linuxAdapter')).default
  }
}

export default (async () => { return await getAdapter() })()
