import useSettingStore from '@/store/settings'
import { loadCoreResources } from '@/utils/core_functions'
import type { ComponentStatus, ComponentType } from '@type/componentManager'

export default {
  load: async function (showTip = true) {
    let loaded = true
    const settingStore = useSettingStore()

    loaded = await window.main.CoreLoader.load()
    if (loaded) {
      await loadCoreResources('CN')
    }
    if (settingStore.clientType !== 'CN') {
      await loadCoreResources(settingStore.clientType)
    }
    settingStore.updateVersionInfo()

    window.removeLoading()

    const components: Partial<Record<ComponentType, ComponentStatus>> = {
      'Maa Core': await window.main.ComponentManager.getStatus('Maa Core'),
    }

    const showError = showTip ? window.$message.error : undefined

    for (const [component, status] of Object.entries(components)) {
      if (!status) {
        showError?.call(this, `${component}的相关组件未加载`)
        loaded = false
        break
      }
      if (status === 'not-installed') {
        showError?.call(this, `${component}未安装`)
        loaded = false
        break
      }
      if (status === 'not-compatible') {
        showError?.call(this, `${component}不兼容`)
        loaded = false
        break
      }
      if (status === 'installing' || status === 'upgrading') {
        showError?.call(this, `${component}正在安装中...`)
        loaded = false
        break
      }
      if (status === 'need-restart') {
        loaded = true
        break
      }
    }

    return loaded
  },
  dispose: async () => await window.main.CoreLoader.dispose(),
  upgradeCore: async () => await window.main.CoreLoader.upgrade(),
}
