import fs from 'fs'
import { ipcMainHandle } from '@main/utils/ipc-main'
import logger from '@main/utils/logger'

export default function useTaskHooks (): void {
  ipcMainHandle('main.Task:readInfrastConfig', async (event, args: {filepath: string}) => {
    if (!fs.existsSync(args.filepath)) {
      logger.error('readInfrastConfig error, file not exist', args.filepath)
      return ''
    }
    try {
      return fs.readFileSync(args.filepath, 'utf-8')
    } catch (error) {
      logger.error('readInfrastConfig error', error, args.filepath)
      return ''
    }
  })
}
