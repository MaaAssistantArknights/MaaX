import useLoggerHooks from "./logger";
import useVersionHooks from "./version";
import getEmulatorHooks from "./emulator";
import useAsstHooks from "./asst";
import useStorageHooks from "./storage";
import useOsHooks from "./os";
import usePathHooks from "./path";
import useUnzipHooks from "./unzip";

export default function useHooks() {
  useLoggerHooks();
  useVersionHooks();
  getEmulatorHooks();
  useAsstHooks();
  useStorageHooks();
  useOsHooks();
  usePathHooks();
  useUnzipHooks();
}