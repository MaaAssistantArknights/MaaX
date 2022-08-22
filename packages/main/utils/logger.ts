import path from 'path'
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
  }

  private readonly logToTransport = (logObject: ILogObject): void => {
    this.log_file_.write(JSON.stringify(logObject) + '\n')
  }

  public get main (): tslog.Logger {
    return this.main_
  }

  public get renderer (): tslog.Logger {
    return this.renderer_
  }

  private readonly main_: tslog.Logger
  private readonly renderer_: tslog.Logger

  private readonly log_file_: WriteStream

  private readonly log_file_path_ = path.join(getAppBaseDir(), 'logs')
}

const logger = new Logger()

export const renderer = logger.renderer
export const main = logger.main

export default logger.main
