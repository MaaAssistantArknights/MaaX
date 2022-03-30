import { ipcMain } from 'electron'

export default function useOsHooks () {
  ipcMain.handle('os:arch', async (event) => {
    let arch = 'NoArch'
    switch (process.arch) {
      case 'x64':
        arch = 'x64'
        break
      case 'arm64':
        arch = 'arm64'
        break
    }
    return arch
  })

  ipcMain.handle('os:platform', async (event) => {
    let platform = 'NoPlatform'
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
  })
}
