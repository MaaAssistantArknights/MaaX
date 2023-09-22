import storage from '@/hooks/caller/storage'
import _ from 'lodash'
import type { PiniaPluginContext } from 'pinia'

export default function watcher(context: PiniaPluginContext): void {
  context.store.$subscribe(
    (mutation, state) => {
      if (mutation.type === 'patch function') {
        return
      }
      storage.set(mutation.storeId, _.cloneDeep(state))
      console.log('configutation sync')
    },
    { deep: true }
  )
}
