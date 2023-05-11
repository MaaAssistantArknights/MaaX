import { session } from 'electron'

export function updateUA(urls: string[], UA: string) {
  const filter = { urls }
  session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
    details.requestHeaders['User-Agent'] = UA
    callback({ requestHeaders: details.requestHeaders })
  })
}

export function updatePenguinUA(UA: string) {
  updateUA(['https://penguin-stats.io/*'], UA)
}
