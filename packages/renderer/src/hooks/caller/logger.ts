export default {
  silly: (...params: any[]) => window.main.Util.LogSilly(...params),
  debug: (...params: any[]) => window.main.Util.LogDebug(...params),
  trace: (...params: any[]) => window.main.Util.LogTrace(...params),
  info: (...params: any[]) => window.main.Util.LogInfo(...params),
  warn: (...params: any[]) => window.main.Util.LogWarn(...params),
  error: (...params: any[]) => window.main.Util.LogError(...params),
  fatal: (...params: any[]) => window.main.Util.LogFatal(...params),
}
