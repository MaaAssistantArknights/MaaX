import { is } from 'electron-util'
import { format } from 'date-fns'
import log4js from 'log4js'
import chalk from 'chalk'
import { app } from 'electron'
import path from 'path'

const timeFormat = 'yyyy-MM-dd HH:mm:ss.SSS'

class Logger {
  public constructor () {
    chalk.level = 1
    log4js.addLayout('stdout', () => {
      return (event) => {
        const { startTime } = event
        const timeStr = format(startTime, timeFormat)
        const message =
          typeof event.data[0] === 'string' ? event.data[0] : JSON.stringify(event.data[0])
        const line = `[${timeStr}] ${event.level.levelStr} > ${message}`
        let colored = (msg: string): string => msg
        let stackColored = (msg: string): string => msg
        switch (event.level.level) {
          case 5000: // trace
            colored = chalk.bgWhite
            break
          case 10000: // debug
            colored = chalk.gray
            break
          case 20000: // info
            colored = chalk.bgCyan
            break
          case 30000: // warn
            colored = chalk.bgYellow
            break
          case 40000: // error
            colored = chalk.bgRed
            stackColored = chalk.red
            break
          case 50000: // fatal
            colored = chalk.bgMagenta
            stackColored = chalk.magenta
            break
        }

        return `${colored(line)}${stackColored(event.level.level > 30000 ? `\n${event.callStack ?? ''}` : '')}`
      }
    })
    log4js.addLayout('file', () => {
      return (event) => {
        const { startTime } = event
        const timeStr = format(startTime, timeFormat)
        const message =
          typeof event.data[0] === 'string' ? event.data[0] : JSON.stringify(event.data[0])

        const line = `[${timeStr}] ${event.level.levelStr} > ${message}`
        return `${line}${event.level.level > 30000 ? `\n${event.callStack ?? ''}` : ''}`
      }
    })
    log4js.configure({
      appenders: {
        stdout: { type: 'stdout', layout: { type: 'stdout' } },
        file: {
          type: 'fileSync',
          filename: path.join(app.getPath('appData'), app.getName(),
            'log', `ui-${format(new Date(), 'yyyyMMddhhmmss')}.log`),
          layout: { type: 'file' }
        }
      },
      categories: {
        default: {
          appenders: ['file', 'stdout'],
          level: is.development ? 'trace' : 'info',
          enableCallStack: true
        }
      }
    })
    this._log = log4js.getLogger()
  }

  public get logger (): log4js.Logger {
    return this._log
  }

  private readonly _log: log4js.Logger;
}

const log = new Logger()

export default log.logger
