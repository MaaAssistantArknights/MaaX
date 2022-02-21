import installExtension from "electron-devtools-installer"
import type { BrowserWindow } from "electron"

function useDebug(window: BrowserWindow) {
  installExtension("nhdogjmejiglipccpnnnanhbledajbpd")
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) =>
      console.error("An error occurred while install extension: ", err)
    )
  window.webContents.openDevTools({ mode: "detach" })
}

export default useDebug
