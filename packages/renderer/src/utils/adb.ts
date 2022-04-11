import downloader from '@/hooks/caller/download'

export async function installAdb (): Promise<void> {
  const message = window.$message.loading('开始下载必要组件', { duration: 0 })
  const adbdir = await window.ipcRenderer.invoke('path:adb')
  const tempdir = await window.ipcRenderer.invoke('path:app', 'temp')
  const platform = await window.ipcRenderer.invoke('os:platform') as Api.Maa.Platform
  let url = ''
  switch (platform) {
    case 'windows':
      url = 'https://maa.alisaqaq.moe/static/platform-tools_r33.0.1-windows.zip'
      break
    case 'macos':
      url = 'https://maa.alisaqaq.moe/static/platform-tools_r33.0.1-darwin.zip'
      break
    case 'linux':
      url = 'https://maa.alisaqaq.moe/static/platform-tools_r33.0.1-linux.zip'
      break
  }
  if (url.length === 0) {
    message.content = '这个系统Adb好像不支持'
    message.type = 'error'
    setTimeout(() => {
      message.destroy()
    }, 5000)
  }
  downloader.newDownloadFile({
    url: url,
    path: tempdir
  })

  const updateListener = (_: Electron.IpcRendererEvent, item: any): void => {
    message.content = `Adb下载中 ${Math.ceil(item.progress * 100)}%`
  }
  const doneListener = (_: Electron.IpcRendererEvent, item: any): void => {
    message.content = 'Adb解压中...'
    window.ipcRenderer.send('unzip:file', item.path, adbdir)
  }
  window.ipcRenderer.on('download:itemUpdate', updateListener)
  window.ipcRenderer.on('download:itemDone', doneListener)

  const zipDoneListener = async (): Promise<void> => {
    window.ipcRenderer.off('download:itemUpdate', updateListener)
    window.ipcRenderer.off('download:itemDone', doneListener)
    message.content = 'Adb安装完成'
    message.type = 'success'
    setTimeout(() => {
      message.destroy()
    }, 5000)
    window.ipcRenderer.off('unzip:done', zipDoneListener)
  }
  window.ipcRenderer.on('unzip:done', zipDoneListener)

  await new Promise<void>((resolve) => {
    const timer = setInterval(() => {
      if (window.ipcRenderer.listenerCount('unzip:done') === 0) {
        clearInterval(timer)
        resolve()
      }
    })
  })
}
