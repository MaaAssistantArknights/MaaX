import type { ComponentType } from '@type/componentManager'
import type { InstallerStatus } from '@type/misc'

import type { Notifier } from '../types'

export function createNotifier(
  type: ComponentType,
  status: {
    status: InstallerStatus
  }
): Notifier {
  return {
    onStart() {},
    onProgress(progress: number) {
      globalThis.renderer.ComponentManager.updateStatus({
        type,
        status: status.status,
        progress,
      })
    },
    onCompleted() {
      status.status = 'done'
      globalThis.renderer.ComponentManager.installDone({
        type,
        status: 'done',
        progress: 0,
      })
    },
    onDownloadedUpgrade() {
      globalThis.renderer.ComponentManager.downloadUpgradeDone({
        type,
        status: status.status,
        progress: 0,
      })
    },
    onException() {
      status.status = 'exception'
      globalThis.renderer.ComponentManager.installInterrupted({
        type,
        status: 'exception',
        progress: 0,
      })
    },
  }
}
