export default {
  log: (...params: any[]) => window.ipcRenderer.send('log:log', ...params),
  debug: (...params: any[]) => window.ipcRenderer.send('log:debug', ...params),
  error: (...params: any[]) => window.ipcRenderer.send('log:error', ...params),
  info: (...params: any[]) => window.ipcRenderer.send('log:info', ...params),
  silly: (...params: any[]) => window.ipcRenderer.send('log:silly', ...params),
  verbose: (...params: any[]) => window.ipcRenderer.send('log:verbose', ...params),
  warn: (...params: any[]) => window.ipcRenderer.send('log:warn', ...params)
}
