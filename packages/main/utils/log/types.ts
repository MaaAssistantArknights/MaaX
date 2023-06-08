type LowerAll<Ks extends string[]> = Ks extends [infer X, ...infer YS]
  ? X extends string
    ? YS extends string[]
      ? [Lowercase<X>, ...LowerAll<YS>]
      : []
    : []
  : []

export type TLogLevel = ['SILLY', 'DEBUG', 'TRACE', 'INFO', 'WARN', 'ERROR', 'FATAL']
export type TLogLevelLo = LowerAll<TLogLevel>
export type TLogFunction = (...args: any[]) => void

export type TLogger = {
  [key in TLogLevelLo[number]]: TLogFunction
}

export interface TLoggerEnv {
  name: string
  source: {
    file: string
    func: string
    stack: string
  }
  date: {
    year: number
    month: number
    date: number

    hour: number
    minute: number
    second: number
    msec: number // XXX
  }
  level: string
  content: {
    pretty: string
    mono: string
  }
}
