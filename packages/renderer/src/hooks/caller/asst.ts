import useSettingStore from '@/store/settings'

export default {
  load: async function (showTip = true) {
    let loaded = true
    const components: Partial<Record<ComponentType, ComponentStatus>> = {
      'Maa Core': await window.ipcRenderer.invoke('main.ComponentManager:getStatus', 'Maa Core'),
      'Maa Resource': await window.ipcRenderer.invoke('main.ComponentManager:getStatus', 'Maa Resource'),
      'Maa Dependency': await window.ipcRenderer.invoke('main.ComponentManager:getStatus', 'Maa Dependency')
    }
    const settingStore = useSettingStore()
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
    }
    loaded = await window.ipcRenderer.invoke('main.CoreLoader:load')
    settingStore.updateVersionInfo()
    return loaded
  },
  dispose: async () => await (window.ipcRenderer.invoke('main.CoreLoader:dispose') as Promise<void>)
}
