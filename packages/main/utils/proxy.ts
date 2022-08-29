import type { BrowserWindow } from 'electron'

async function detectSystemProxy (window: BrowserWindow): Promise<string> {
  const ses = window.webContents.session
  const proxy = await ses.resolveProxy('https://www.google.com')
  return `http://${proxy.replace('PROXY', '').trim()}`
}

export default detectSystemProxy
