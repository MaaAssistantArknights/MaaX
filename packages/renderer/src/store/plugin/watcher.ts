import type { PiniaPluginContext } from "pinia";
import _ from "lodash";
import storage from "@/hooks/caller/storage";

export default function watcher(context: PiniaPluginContext) {
  context.store.$subscribe((mutation, state ) => {
    storage.set(mutation.storeId, _.cloneDeep(state));
  });
}
