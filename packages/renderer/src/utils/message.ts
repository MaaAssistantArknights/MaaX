import { MessageOptions } from 'naive-ui'
import { VNodeChild } from 'vue'

export const hide = (): void => {
  window.$message.destroyAll()
}

/**
 * 天降神谕
 * @param content 神谕内容
 * @param options 神谕选项
 * @param _hide 隐藏之前的神谕
 */
export const show = (content: string | (() => VNodeChild), options: MessageOptions, _hide?: boolean): void => {
  if (_hide) hide()
  window.$message.create(content, options)
}
