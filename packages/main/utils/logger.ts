import { format } from 'date-fns'
import { WriteStream, appendFileSync, createWriteStream, existsSync, mkdirSync } from 'fs'
import path from 'path'

import { setupHookProxy } from './ipc-main'
import { type TLogger, createLogger, createPresetFormatter, initLogger } from './log'
import { getAppBaseDir } from './path'

class Logger {
  public constructor() {
    if (!existsSync(this.log_file_dir_)) {
      mkdirSync(this.log_file_dir_)
    }

    const date = format(new Date(), 'yyyyMMdd')
    this.log_file_path_ = path.join(this.log_file_dir_, `Maa App-${date}.log`)

    this.log_file_ = createWriteStream(this.log_file_path_, { flags: 'a' })

    const formatter = createPresetFormatter(out => {
      console.log(out.cons[0], ...out.cons[1])
      this.log_file_.write(out.mono + '\n')
    })

    initLogger()

    const [ml, mc] = createLogger('main', formatter)
    this.main_ = ml

    const [rl, rc] = createLogger('renderer', formatter)
    this.renderer_ = rl

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

  private readonly main_: TLogger
  private readonly renderer_: TLogger

  private readonly log_file_: WriteStream

  private readonly log_file_dir_ = path.join(getAppBaseDir(), 'logs')
}

const logger = new Logger()

export default logger.main

export const manager = logger
