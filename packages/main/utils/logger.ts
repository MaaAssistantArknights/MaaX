import path from 'path'
import { ipcMainHandle } from './ipc-main'
import tslog, { ILogObject } from 'tslog'
import { createWriteStream, mkdirSync, existsSync, WriteStream } from 'fs'
import { getAppBaseDir } from './path'

class Logger {
  public constructor () {
    this.main_ = new tslog.Logger({
      name: 'main'
    })
    this.renderer_ = new tslog.Logger({
      name: 'renderer'
    })

    if (!existsSync(this.log_file_path_)) {
      mkdirSync(this.log_file_path_)
    }

    this.log_file_ = createWriteStream(
      path.join(this.log_file_path_, 'Maa App.log'),
      { flags: 'a' }
    )

    this.main_.attachTransport({
      silly: this.logToTransport,
      debug: this.logToTransport,
      trace: this.logToTransport,
      info: this.logToTransport,
      warn: this.logToTransport,
      error: this.logToTransport,
      fatal: this.logToTransport
    }, 'debug')
    this.renderer_.attachTransport({
      silly: this.logToTransport,
      debug: this.logToTransport,
      trace: this.logToTransport,
      info: this.logToTransport,
      warn: this.logToTransport,
      error: this.logToTransport,
      fatal: this.logToTransport
    }, 'debug')

    ipcMainHandle('main:Util:LogSilly', (event, ...params) => {
      this.renderer_.silly(...params)
    })
    ipcMainHandle('main:Util:LogDebug', (event, ...params) => {
      this.renderer_.debug(...params)
    })
    ipcMainHandle('main:Util:LogTrace', (event, ...params) => {
      this.renderer_.trace(...params)
    })
    ipcMainHandle('main:Util:LogInfo', (event, ...params) => {
      this.renderer_.info(...params)
    })
    ipcMainHandle('main:Util:LogWarn', (event, ...params) => {
      this.renderer_.warn(...params)
    })
    ipcMainHandle('main:Util:LogError', (event, ...params) => {
      this.renderer_.error(...params)
    })
    ipcMainHandle('main:Util:LogFatal', (event, ...params) => {
      this.renderer_.fatal(...params)
    })
  }

  private readonly logToTransport = (logObject: ILogObject): void => {
    this.main_.getChildLogger({
      colorizePrettyLogs: false,
      dateTimeTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      prettyInspectOptions: {
        colors: false
      }
    })
      .printPrettyLog(this.log_file_, logObject)
  }

  public get main (): tslog.Logger {
    return this.main_
  }

  private readonly main_: tslog.Logger
  private readonly renderer_: tslog.Logger

  private readonly log_file_: WriteStream

  private readonly log_file_path_ = path.join(getAppBaseDir(), 'logs')
}

const logger = new Logger()

export default logger.main
