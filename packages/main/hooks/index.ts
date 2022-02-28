import useLoggerHooks from "./logger";
import useVersionHooks from "./version";

export default function useHooks() {
  useLoggerHooks();
  useVersionHooks();
}