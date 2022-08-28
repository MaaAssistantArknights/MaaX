/**
 * @file hooks/events/ui.ts
 * @description ui人机交互钩子
 */

export default function useUiHooks (): void {
  window.ipcRenderer.on('renderer.WindowManager:showMessage', (event, arg) => {
    // ? 是否需要用string包裹防止xss
    event.returnValue = window.$message.create(String(arg.message), arg.options)
  })

  window.ipcRenderer.on('renderer.WindowManager:loaded', () => {
    window.removeLoading()
  })
}
