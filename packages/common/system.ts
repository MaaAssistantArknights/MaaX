import { $ } from 'zx'
import { is } from 'electron-util'

export const getShell = (): $ => {
  if (is.windows) {
    $.shell = 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe'
    $.prefix = ''
  }
  return $
}
