import { format, formatWithOptions } from 'util'
import type { TLogLevel, TLogger, TLoggerEnv } from './types'
import chalk from 'chalk'

const LogLevel: TLogLevel = ['SILLY', 'DEBUG', 'TRACE', 'INFO', 'WARN', 'ERROR', 'FATAL']

function createLogger(name: string, output: (env: TLoggerEnv) => void): TLogger {
  function log(level: number, ...args: any[]) {
    const now = new Date()
    const stack = new Error().stack?.split('\n')[3] ?? ''

    const match = /^\s+at\s+([\s\S]+?)(?:\s+\(([\s\S]+)\))$/.exec(stack)

    const env: TLoggerEnv = {
      name,
      source: {
        file: match?.[2] ?? 'Unknown file',
        func: match?.[1] ?? 'Unknown function',
        stack,
      },
      date: {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        date: now.getDate(),
        hour: now.getHours(),
        minute: now.getMinutes(),
        second: now.getSeconds(),
        msec: now.getMilliseconds(),
      },
      level: LogLevel[level],
      content: {
        pretty: formatWithOptions(
          {
            colors: true,
          },
          '',
          ...args
        ).slice(1),
        mono: formatWithOptions(
          {
            colors: false,
          },
          '',
          ...args
        ).slice(1),
      },
    }
    output(env)
  }

  const res = {} as TLogger
  for (const [l, s] of LogLevel.entries()) {
    res[s.toLowerCase() as Lowercase<typeof s>] = (...args) => {
      log(l, ...args)
    }
  }
  return res
}

export function createPresetFormatter(output: (out: { pretty: string; mono: string }) => void) {
  return (env: TLoggerEnv) => {
    const time = `${env.date.year.toString().padStart(4, '0')}-${env.date.month
      .toString()
      .padStart(2, '0')}-${env.date.date.toString().padStart(2, '0')} ${env.date.hour
      .toString()
      .padStart(2, '0')}-${env.date.minute.toString().padStart(2, '0')}:${env.date.second
      .toString()
      .padStart(2, '0')}.${env.date.msec.toString().padStart(3, '0')}`

    output({
      pretty: [
        time,
        chalk.bold(env.level),
        env.source.file,
        chalk.bold(env.name),
        env.content.pretty,
      ].join('\t'),
      mono: [time, env.level, env.source.file, env.name, env.content.mono].join('\t'),
    })
  }
}
