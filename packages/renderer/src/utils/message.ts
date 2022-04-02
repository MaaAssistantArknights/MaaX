import { MessageOptions } from 'naive-ui'
import { VNodeChild } from 'vue'

export const hide = (): void => {
  window.$message.destroyAll()
}

export const show = (content: string | (() => VNodeChild), options: MessageOptions): void => {
  hide()
  window.$message.create(content, options)
}
