import WindowFactory from "../window/factory";

type MessageType = "info" | "success" | "warning" | "error" | "loading" | "default";

export default {
  message: (message: string, type: MessageType) => WindowFactory.getInstance().webContents.send("ui:message", {
    message,
    type
  })
};