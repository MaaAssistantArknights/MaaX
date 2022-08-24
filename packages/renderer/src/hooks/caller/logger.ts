export default {
  silly: (...params: any[]) => window.ipcRenderer.invoke('main:Util:LogSilly', ...params),
  debug: (...params: any[]) => window.ipcRenderer.invoke('main:Util:LogDebug', ...params),
  trace: (...params: any[]) => window.ipcRenderer.invoke('main:Util:LogTrace', ...params),
  info: (...params: any[]) => window.ipcRenderer.invoke('main:Util:LogInfo', ...params),
  warn: (...params: any[]) => window.ipcRenderer.invoke('main:Util:LogWarn', ...params),
  error: (...params: any[]) => window.ipcRenderer.invoke('main:Util:LogError', ...params),
  fatal: (...params: any[]) => window.ipcRenderer.invoke('main:Util:LogFatal', ...params)
}
