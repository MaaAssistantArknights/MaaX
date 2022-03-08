import useLoggerHooks from "./logger";
import useVersionHooks from "./version";
import getEmulatorHooks from "./emulator";
import useAsstHooks from "./asst";

export default function useHooks() {
  useLoggerHooks();
  useVersionHooks();
  getEmulatorHooks();
  useAsstHooks();
}