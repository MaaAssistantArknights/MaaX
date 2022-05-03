/**
 * @file hooks/events/ui.ts
 * @description ui人机交互钩子
 */

export default function useUiHooks (): void {
  window.ipcRenderer.on('ui:message', (event, arg) => {
    // ? 是否需要用string包裹防止xss
    event.returnValue = window.$message.create(String(arg.message), arg.options)
  })

  window.ipcRenderer.on('ui:loaded', () => {
    console.log('ui:loaded')
    window.removeLoading()
  })
}
