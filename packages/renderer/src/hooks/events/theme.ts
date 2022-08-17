import useThemeStore from '@/store/theme'

export default function useThemeEvents (): void {
  const themeStore = useThemeStore()
  window.ipcRenderer.on('renderer.AppearanceManager:themeUpdated', (_, updatedTheme) => {
    themeStore.updateSystemTheme(updatedTheme)
  })
}
