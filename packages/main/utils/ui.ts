import WindowManager from '@main/windowManager'

type MessageType = 'info' | 'success' | 'warning' | 'error' | 'loading' | 'default'

export default {
  message: (message: string, type: MessageType) => new WindowManager().getWindow().webContents.send('ui:message', {
    message,
    type
  })
}
