import installExtension from 'electron-devtools-installer'
import { BrowserWindow } from 'electron'
import logger from './logger'

function useDebug(window: BrowserWindow): void {
  installExtension('nhdogjmejiglipccpnnnanhbledajbpd')
    .then(name => logger.info(`Added Extension:  ${name}`))
    .catch((err: Error) =>
      logger.error(`An error occurred while install extension: ${err.message}`)
    )
  window.webContents.openDevTools({ mode: 'detach' })
  // Bypass CORS
  window.webContents.session.webRequest.onBeforeSendHeaders(
    {
      urls: [
        'https://prts.wiki/*',
        'https://maa.alisaqaq.moe/*',
        'https://penguin-stats.io/*',
      ],
    },
    (details, callback) => {
      details.requestHeaders.Origin = new URL(details.url).origin
      callback(details)
    }
  )
  window.webContents.session.webRequest.onHeadersReceived(
    {
      urls: [
        'https://prts.wiki/*',
        'https://maa.alisaqaq.moe/*',
        'https://penguin-stats.io/*',
      ],
    },
    (details, callback) => {
      const corsHeader = { 'access-control-allow-origin': '*' }
      details.responseHeaders = Object.assign(
        details.responseHeaders ?? {},
        corsHeader
      )
      callback(details)
    }
  )
}

export default useDebug
