import CoreLoader from '@main/coreLoader'
import { app } from 'electron'

export default function useVersionHooks(): void {
  globalThis.main.Util.getUiVersion = () => app.getVersion()
  globalThis.main.CoreLoader.getCoreVersion = () => new CoreLoader().GetCoreVersion()
}
