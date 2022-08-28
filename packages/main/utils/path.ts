import { app } from 'electron'
import path from 'path'

export const getAppBaseDir = (): string => path.join(app.getPath('appData'), app.getName())
