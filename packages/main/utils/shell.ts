import logger from '@main/utils/logger'
import { is } from 'electron-util'
import execa from 'execa'

interface processOutput {
  stdout: string
  stderr: string
}

/**
 * 异步执行shell命令,
 * 示例: $\`tasklist | findstr ${name}\`
 * @returns Promise<{stdout:string, stderr:string}>
 */
export async function $ (pieces: TemplateStringsArray, ...args: string[]): Promise<processOutput> {
  const ret = { stderr: '', stdout: '' }

  let cmd = pieces[0]
  if (is.windows) cmd = '& ' + pieces[0]
  let i = 0
  while (i < args.length) {
    cmd += args[i] + pieces[++i]
  }

  logger.debug(`exec: ${cmd}`)

  try {
    ret.stdout = (await execa(cmd, { shell: is.windows ? 'powershell' : 'bash' })).stdout
  } catch (err: any) {
    ret.stderr = err
  }
  logger.debug(ret)
  return ret
}

/**
 * 以文件名+参数形式异步执行shell命令
 * @param file 文件路径
 * @param args 参数
 * @returns Promise<{stdout:string, stderr:string}>
 */
export async function $$ (file: string, args?: string[]): Promise<processOutput> {
  const ret = { stderr: '', stdout: '' }
  logger.debug(`exec: ${file} ${args ? args.join(' ') : ''}`)

  try {
    ret.stdout = (await execa(file, args)).stdout
  } catch (err: any) {
    ret.stderr = err
  }
  logger.debug(ret)
  return ret
}
