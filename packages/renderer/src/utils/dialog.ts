import { DialogOptions, DialogReactive } from 'naive-ui'

export const confirm = (options: DialogOptions): DialogReactive=>{
    return window.$dialog.warning(options)
}