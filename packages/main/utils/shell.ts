import logger from '@main/utils/logger'
import { is } from 'electron-util'
import execa from 'execa'

interface processOutput {
  stdout: string
  stderr: string
}

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
    const { stdout } = await execa(cmd, { shell: is.windows ? 'powershell' : 'bash' })
    ret.stdout = stdout
  } catch (err: any) {
    logger.error(err)
    ret.stderr = err.stderr
  }
  logger.debug('exec output:')
  console.log(ret)
  return ret
}
