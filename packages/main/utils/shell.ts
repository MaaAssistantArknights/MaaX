import { execa as EXECA, type ExecaError } from 'execa'
import iconv from 'iconv-lite'
import logger from '@main/utils/logger'
import { getPlatform } from '@main/utils/os'

let execa: typeof EXECA = () => void 0 as any

import('execa').then(({ execa: e }) => {
  execa = e
})

interface ProcessOutput {
  stdout: string
  stderr: string
}

const textDecoder = (buf: Buffer): string =>
  iconv.decode(buf, getPlatform() === 'windows' ? 'gb2312' : 'utf8')

/**
 * 异步执行shell命令,
 * 示例: $\`tasklist | findstr ${name}\`
 * @returns Promise<{stdout:string, stderr:string}>
 */
export async function $(pieces: TemplateStringsArray, ...args: string[]): Promise<ProcessOutput> {
  const ret = { stderr: '', stdout: '' }

  let cmd = pieces[0]
  if (getPlatform() === 'windows') cmd = '& ' + pieces[0]
  let i = 0
  while (i < args.length) {
    cmd += args[i] + pieces[++i]
  }

  logger.info(`exec: ${cmd}`)

  try {
    const { stdout, stderr } = await execa(cmd, {
      shell: getPlatform() === 'windows' ? 'powershell' : 'bash',
      encoding: null,
    })
    ret.stdout = textDecoder(stdout)
    ret.stderr = textDecoder(stderr)
  } catch (err: any) {
    const error = err as ExecaError<Buffer>
    const { stdout, stderr } = error
    ret.stdout = textDecoder(stdout)
    ret.stderr = textDecoder(stderr)
  }
  logger.info(ret)
  return ret
}

/**
 * 以文件名+参数形式异步执行shell命令
 * @param file 文件路径
 * @param args 参数
 * @returns Promise<{stdout:string, stderr:string}>
 */
export async function $$(file: string, args?: string[]): Promise<ProcessOutput> {
  const ret = { stderr: '', stdout: '' }
  logger.info(`exec: ${file} ${args ? args.join(' ') : ''}`)
  try {
    const { stdout, stderr } = await execa(file, args, {
      encoding: null,
      detached: true,
    })
    ret.stdout = textDecoder(stdout)
    ret.stderr = textDecoder(stderr)
  } catch (err: any) {
    const error = err as ExecaError<Buffer>
    const { stdout, stderr } = error
    ret.stdout = textDecoder(stdout)
    ret.stderr = textDecoder(stderr)
  }
  logger.info(ret)
  return ret
}
