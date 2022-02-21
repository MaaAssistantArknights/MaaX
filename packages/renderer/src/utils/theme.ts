export default function useTheme() {
  const root = document.querySelector("html");
  window.ipcRenderer.on("theme:update", (_, theme) => {
    root?.setAttribute("data-theme", theme);
  });
}
