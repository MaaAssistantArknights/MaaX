import installExtension from 'electron-devtools-installer'
import type { BrowserWindow } from 'electron'

function useDebug (window: BrowserWindow): void {
  installExtension('nhdogjmejiglipccpnnnanhbledajbpd')
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) =>
      console.error('An error occurred while install extension: ', err)
    )
  window.webContents.openDevTools({ mode: 'detach' })
  // Bypass CORS
  window.webContents.session.webRequest.onBeforeSendHeaders(
    {
      urls: ['https://prts.wiki/*', 'https://maa.alisaqaq.moe/*']
    },
    (details, callback) => {
      details.requestHeaders.Origin = new URL(details.url).origin
      callback(details)
    }
  )
  window.webContents.session.webRequest.onHeadersReceived(
    {
      urls: ['https://prts.wiki/*', 'https://maa.alisaqaq.moe/*']
    },
    (details, callback) => {
      const corsHeader = { 'access-control-allow-origin': '*' }
      details.responseHeaders = Object.assign(details.responseHeaders ?? {}, corsHeader)
      callback(details)
    }
  )
}

export default useDebug
