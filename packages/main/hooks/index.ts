import useLoggerHooks from "./logger";
import useVersionHooks from "./version";
import getEmulatorHooks from "./emulator";
import useAsstHooks from "./asst";
import useStorageHooks from "./storage";

export default function useHooks() {
  useLoggerHooks();
  useVersionHooks();
  getEmulatorHooks();
  useAsstHooks();
  useStorageHooks();
}