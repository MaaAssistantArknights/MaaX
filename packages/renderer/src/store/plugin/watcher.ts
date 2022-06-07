import type { PiniaPluginContext } from 'pinia'
import _ from 'lodash'
import storage from '@/hooks/caller/storage'

export default function watcher (context: PiniaPluginContext): void {
  context.store.$subscribe((mutation, state) => {
    if (mutation.type === 'patch function') {
      return
    }
    storage.set(mutation.storeId, _.cloneDeep(state))
    console.log('configutation sync')
  }, { deep: true })
}
