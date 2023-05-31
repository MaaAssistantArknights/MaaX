import path from 'path'
import { format } from 'date-fns'
import tslog, { type ILogObject } from 'tslog'
import { createWriteStream, mkdirSync, existsSync, WriteStream } from 'fs'
import { getAppBaseDir } from './path'

class Logger {
  public constructor() {
    this.main_ = new tslog.Logger({
      name: 'main',
    })
    this.renderer_ = new tslog.Logger({
      name: 'renderer',
    })

    if (!existsSync(this.log_file_dir_)) {
      mkdirSync(this.log_file_dir_)
    }

    const date = format(new Date(), 'yyyyMMdd')
    this.log_file_path_ = path.join(this.log_file_dir_, `Maa App-${date}.log`)

    this.log_file_ = createWriteStream(this.log_file_path_, { flags: 'a' })

    this.main_.attachTransport(
      {
        silly: this.logToTransport,
        debug: this.logToTransport,
        trace: this.logToTransport,
        info: this.logToTransport,
        warn: this.logToTransport,
        error: this.logToTransport,
        fatal: this.logToTransport,
      },
      'debug'
    )

    this.renderer_.attachTransport(
      {
        silly: this.logToTransport,
        debug: this.logToTransport,
        trace: this.logToTransport,
        info: this.logToTransport,
        warn: this.logToTransport,
        error: this.logToTransport,
        fatal: this.logToTransport,
      },
      'debug'
    )

    globalThis.main.Util = {
      LogSilly: (...params) => {
        this.renderer_.silly(...params)
      },
      LogDebug: (...params) => {
        this.renderer_.debug(...params)
      },
      LogTrace: (...params) => {
        this.renderer_.trace(...params)
      },
      LogInfo: (...params) => {
        this.renderer_.info(...params)
      },
      LogWarn: (...params) => {
        this.renderer_.warn(...params)
      },
      LogError: (...params) => {
        this.renderer_.error(...params)
      },
      LogFatal: (...params) => {
        this.renderer_.fatal(...params)
      },
    }
  }

  private readonly logToTransport = (logObject: ILogObject): void => {
    this.main_
      .getChildLogger({
        colorizePrettyLogs: false,
        dateTimeTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        prettyInspectOptions: {
          colors: false,
          depth: 20,
        },
      })
      .printPrettyLog(this.log_file_, logObject)
  }

  public get logFilePath(): string {
    return this.log_file_path_
  }

  public get logFileDir(): string {
    return this.log_file_dir_
  }

  public get main(): tslog.Logger {
    return this.main_
  }

  private readonly log_file_path_: string

  private readonly main_: tslog.Logger
  private readonly renderer_: tslog.Logger

  private readonly log_file_: WriteStream

  private readonly log_file_dir_ = path.join(getAppBaseDir(), 'logs')
}

const logger = new Logger()

export default logger.main

export const manager = logger
