import useDeviceEvents from "./events/devices";
import useTaskEvents from "./events/tasks";
import useThemeEvents from "./events/theme";

export function initHook() {
  useDeviceEvents();
  useTaskEvents();
  useThemeEvents();
}
