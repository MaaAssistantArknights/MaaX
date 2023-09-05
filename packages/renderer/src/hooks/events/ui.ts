/**
 * @file hooks/events/ui.ts
 * @description ui人机交互钩子
 */

export default function useUiHooks(): void {
  window.renderer.WindowManager = {
    showMessage({ message, options }) {
      // ? 是否需要用string包裹防止xss
      // event.returnValue = window.$message.create(String(message), options)
    },
    loaded() {
      //   window.removeLoading()
    },
  }
}
