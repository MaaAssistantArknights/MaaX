import type { MessageOptions } from 'naive-ui/lib/message/index'

export default {
  message: (message: string, options: MessageOptions = {}) =>
    renderer.WindowManager.showMessage({
      message,
      options,
    }),
}
