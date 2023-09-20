import logger from '@main/utils/logger'
import fs from 'fs'

export default function useTaskHooks(): void {
  globalThis.main.Task.readInfrastConfig = ({ filepath }) => {
    if (!fs.existsSync(filepath)) {
      logger.error('readInfrastConfig error, file not exist', filepath)
      return ''
    }
    try {
      return fs.readFileSync(filepath, 'utf-8')
    } catch (error) {
      logger.error('readInfrastConfig error', error, filepath)
      return ''
    }
  }
}
