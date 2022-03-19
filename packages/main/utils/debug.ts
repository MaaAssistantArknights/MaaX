import installExtension from "electron-devtools-installer";
import type { BrowserWindow } from "electron";
import axios, { Method } from "axios";

function useDebug(window: BrowserWindow) {
  installExtension("nhdogjmejiglipccpnnnanhbledajbpd")
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) =>
      console.error("An error occurred while install extension: ", err)
    );
  window.webContents.openDevTools({ mode: "detach" });
  // Bypass CORS
  window.webContents.session.webRequest.onBeforeRequest(
    { urls: ["https://maa.alisaqaq.moe"] },
    async (details, callback) => {
      callback(await axios.request({
        method: details.method as Method,
        url: details.url,
      }));
    } 
  );
}

export default useDebug;
