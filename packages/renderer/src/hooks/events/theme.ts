import useThemeStore from "@/store/theme";

export default function useThemeEvents() {
  const themeStore = useThemeStore();
  window.ipcRenderer.on("theme:update", (_, updatedTheme) => {
    themeStore.updateTheme(updatedTheme);
  });
}
