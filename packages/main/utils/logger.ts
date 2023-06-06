import path from 'path'
import { format } from 'date-fns'
import { Logger as TSLogger, type ILogObj, transportFormattedOnly } from 'tslog'
import { createWriteStream, mkdirSync, existsSync, WriteStream, appendFileSync } from 'fs'
import { getAppBaseDir } from './path'
import { setupHookProxy } from './ipc-main'

class Logger {
  public constructor() {
    this.main_ = new TSLogger({
      name: 'main',
    })
    this.renderer_ = new TSLogger({
      name: 'renderer',
    })

    if (!existsSync(this.log_file_dir_)) {
      mkdirSync(this.log_file_dir_)
    }

    const date = format(new Date(), 'yyyyMMdd')
    this.log_file_path_ = path.join(this.log_file_dir_, `Maa App-${date}.log`)

    this.log_file_ = createWriteStream(this.log_file_path_, { flags: 'a' })

    const newTransformFormatted = (...args: Parameters<typeof transportFormattedOnly<ILogObj>>) => {
      const text = transportFormattedOnly(...args)
      console.log(text)
      this.log_file_.write(text.replace(/\033\[\d+m/g, '') + '\n')
    }

    this.main_ = new TSLogger({
      name: 'main',
      overwrite: {
        transportFormatted: newTransformFormatted,
      },
    })
    this.renderer_ = new TSLogger({
      name: 'renderer',
      overwrite: {
        transportFormatted: newTransformFormatted,
      },
    })

    // 提前初始化
    setupHookProxy()
    globalThis.main.Util = {
      LogSilly: (...params) => {
        params.pop()
        this.renderer_.silly(...params)
      },
      LogDebug: (...params) => {
        params.pop()
        this.renderer_.debug(...params)
      },
      LogTrace: (...params) => {
        params.pop()
        this.renderer_.trace(...params)
      },
      LogInfo: (...params) => {
        params.pop()
        this.renderer_.info(...params)
      },
      LogWarn: (...params) => {
        params.pop()
        this.renderer_.warn(...params)
      },
      LogError: (...params) => {
        params.pop()
        this.renderer_.error(...params)
      },
      LogFatal: (...params) => {
        params.pop()
        this.renderer_.fatal(...params)
      },
    }
  }

  public get logFilePath(): string {
    return this.log_file_path_
  }

  public get logFileDir(): string {
    return this.log_file_dir_
  }

  public get main() {
    return this.main_
  }

  private readonly log_file_path_: string

  private readonly main_: TSLogger<ILogObj>
  private readonly renderer_: TSLogger<ILogObj>

  private readonly log_file_: WriteStream

  private readonly log_file_dir_ = path.join(getAppBaseDir(), 'logs')
}

const logger = new Logger()

export default logger.main

export const manager = logger
