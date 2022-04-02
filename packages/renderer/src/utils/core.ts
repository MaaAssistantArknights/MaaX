import { maa } from '@/api'
import _ from 'lodash'
import downloader from '@/hooks/caller/download'
import asst from '@/hooks/caller/asst'
import version from '@/hooks/caller/version'

export async function checkCoreVersion (): Promise<boolean> {
  const success = window.sessionStorage.getItem('coreIPCLoadStatus') === 'true' ? true : await asst.load()
  if (success) window.sessionStorage.setItem('coreIPCLoadStatus', 'true')
  const coreVersion = await version.core()
  if (success && coreVersion) {
    return true
  } else {
    return false
  }
}

export async function installCore (currentVersion: string | undefined = undefined): Promise<void> {
  const message = window.$message.loading('开始下载Maa Core', { duration: 0 })
  const os = {
    arch: await window.ipcRenderer.invoke('os:arch') as Api.Maa.Arch,
    platform: await window.ipcRenderer.invoke('os:platform') as Api.Maa.Platform
  }
  const available = await maa.component.getInfo('MaaCore')
  if (_.isError(available)) {
    message.type = 'error'
    message.content = '服务器睡着惹(￣o￣) . z Z，待会再试试吧'
    setTimeout(() => {
      message.destroy()
    }, 5000)
    return
  }
  const supportedVersions =
    available.versions.filter(v =>
      v.support.findIndex(system =>
        system.arch === os.arch && system.platform === os.platform
      ) !== -1
    )
  if (supportedVersions.length === 0) {
    message.type = 'error'
    message.content = '还不支持这个系统哦，再等等吧 (´Д｀ )'
    setTimeout(() => {
      message.destroy()
    }, 5000)
    return
  }
  const getPackageInfo = async (): Promise<Error | {
    platform: Api.Maa.Platform
    arch: Api.Maa.Arch[]
    version: string
    url: string
    hash: string
  }> => {
    if (currentVersion) {
      return await maa.download.getDiffPackage(
        os.platform, os.arch, currentVersion, supportedVersions[0].version, 'MaaCore'
      )
    } else {
      return await maa.download.getCompletePackage(os.platform, os.arch, supportedVersions[0].version, 'MaaCore')
    }
  }
  const packageInfo = await getPackageInfo()
  if (_.isError(packageInfo)) {
    message.type = 'error'
    message.content = '服务器睡着惹(￣o￣) . z Z，待会再试试'
    setTimeout(() => {
      message.destroy()
    }, 5000)
    return
  }
  const tempdir = await window.ipcRenderer.invoke('path:app', 'temp')
  const coredir = await window.ipcRenderer.invoke('path:asst')
  downloader.newDownloadFile({
    url: packageInfo.url,
    path: tempdir
  })
  const updateListener = (_: Electron.IpcRendererEvent, item: any): void => {
    message.content = `MaaCore下载中 ${Math.ceil(item.progress * 100)}%`
  }
  const doneListener = (_: Electron.IpcRendererEvent, item: any): void => {
    message.content = 'MaaCore解压中...'
    asst.dispose()
    window.sessionStorage.setItem('coreIPCLoadStatus', 'false')
    window.ipcRenderer.send('unzip:file', item.path, coredir)
  }
  window.ipcRenderer.on('download:itemUpdate', updateListener)
  window.ipcRenderer.on('download:itemDone', doneListener)

  window.ipcRenderer.once('unzip:done', async (event) => {
    window.ipcRenderer.off('download:itemUpdate', updateListener)
    window.ipcRenderer.off('download:itemDone', doneListener)

    const success = await asst.load()
    if (success) {
      message.content = `MaaCore ${await version.core() as string} 安装完成`
      message.type = 'success'
      setTimeout(() => {
        message.destroy()
      }, 5000)
    } else {
      message.content = '版本好像不匹配哦'
      message.type = 'error'
      setTimeout(() => {
        message.destroy()
      }, 5000)
    }
  })
}
