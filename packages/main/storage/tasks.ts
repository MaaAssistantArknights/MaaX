import {app} from "electron";
import Storage from "electron-store";

const taskStorage = new Storage({
  name: "task",
  cwd: "config",
  watch: true,
});

taskStorage.onDidAnyChange((newValue, oldValue) => {
  console.log("storage changed: ", newValue, "to", oldValue);
});

export default taskStorage;