import installExtension from 'electron-devtools-installer'
import type { BrowserWindow } from 'electron'
import axios, { Method } from 'axios'

function useDebug (window: BrowserWindow) {
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
      callback({ requestHeaders: details.requestHeaders })
    }
  )
  window.webContents.session.webRequest.onHeadersReceived(
    {
      urls: ['https://prts.wiki/*', 'https://maa.alisaqaq.moe/*']
    },
    (details, callback) => {
      details.responseHeaders['access-control-allow-origin'] = ['*']
      callback({ responseHeaders: details.responseHeaders })
    }
  )
}

export default useDebug
