import useThemeStore from '@/store/theme'

export default function useThemeEvents(): void {
  const themeStore = useThemeStore()
  window.renderer.AppearanceManager.systemThemeUpdated = updatedTheme => {
    themeStore.updateSystemTheme(updatedTheme)
  }
}
