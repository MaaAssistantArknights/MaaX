import installExtension from "electron-devtools-installer";
import type { BrowserWindow } from "electron";

function useDebug(window: BrowserWindow) {
  installExtension("nhdogjmejiglipccpnnnanhbledajbpd")
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) =>
      console.error("An error occurred while install extension: ", err)
    );
  window.webContents.openDevTools({ mode: "detach" });
  // Bypass CORS
  window.webContents.session.webRequest.onBeforeSendHeaders(
    (details, callback) => {
      callback({ requestHeaders: { Origin: "http://127.0.0.1:3344", ...details.requestHeaders } });
    }
  );
  window.webContents.session.webRequest.onHeadersReceived(
    (details, callback) => {
      callback({
        responseHeaders: {
          "Access-Control-Allow-Origin": ["http://127.0.0.1:3344"],
          "Access-Control-Allow-Credentials": "true",
          ...details.responseHeaders,
        },
      });
    }
  );
}

export default useDebug;
