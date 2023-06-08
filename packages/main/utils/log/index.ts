import { format, formatWithOptions } from 'util'
import type { TLogLevel, TLogger, TLoggerEnv } from './types'
import chalk from 'chalk'

let pathAlias = (p: string) => p

export type { TLogger, TLoggerEnv }

const LogLevel: TLogLevel = ['SILLY', 'DEBUG', 'TRACE', 'INFO', 'WARN', 'ERROR', 'FATAL']

export function initLogger(proj = process.cwd()) {
  chalk.level = 3
  pathAlias = p => {
    return p.replace(proj, '')
  }
}

export function createLogger(name: string, output: (env: TLoggerEnv) => void): TLogger {
  function log(level: number, ...args: any[]) {
    const now = new Date()
    const stack = new Error().stack?.split('\n')[3] ?? ''

    const match = /^\s*at\s+([\s\S]+?)(?:\s+\(([\s\S]+?)\))?\s*$/.exec(stack)

    const file = pathAlias(match?.[2] ?? match?.[1] ?? 'unknown')
    const func = (match?.[2] ? match?.[1] : null) ?? '<anonymous>'

    const env: TLoggerEnv = {
      name,
      source: {
        file,
        func,
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
        `[${chalk.bold(env.name)} ${env.source.file} ${env.source.func}]`,
        env.content.pretty,
      ].join('\t'),
      mono: [
        time,
        env.level,
        `[${env.name} ${env.source.file} ${env.source.func}]`,
        env.content.mono,
      ].join('\t'),
    })
  }
}
