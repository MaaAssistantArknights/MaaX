import { app } from 'electron'
import CoreLoader from '@main/coreLoader'

export default function useVersionHooks(): void {
  globalThis.main.Util.getUiVersion = () => app.getVersion()
  globalThis.main.CoreLoader.getCoreVersion = () => new CoreLoader().GetCoreVersion()
}
