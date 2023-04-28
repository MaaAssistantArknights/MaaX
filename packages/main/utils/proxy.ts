import type { BrowserWindow } from 'electron'

async function detectSystemProxy(window: BrowserWindow): Promise<string | undefined> {
  const ses = window.webContents.session
  const resolved = await ses.resolveProxy('https://www.google.com')
  const proxy = resolved.replace('PROXY', '').trim()
  return proxy === 'DIRECT' ? undefined : `http://${proxy}`
}

export default detectSystemProxy
