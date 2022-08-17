import useThemeStore from '@/store/theme'

export default function useThemeEvents (): void {
  const themeStore = useThemeStore()
  window.ipcRenderer.on('renderer.AppearanceManager:systemThemeUpdated', (_, updatedTheme) => {
    themeStore.updateSystemTheme(updatedTheme)
  })
}
