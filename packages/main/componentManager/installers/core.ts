/* eslint-disable vue/max-len */
import _ from 'lodash'
import { app } from 'electron'
import axios, { AxiosInstance } from 'axios'

import { Singleton } from '@common/function/singletonDecorator'

import CoreLoader from '@main/coreLoader'

import ComponentInstaller from '../componentInstaller'
import Storage from '@main/storageManager'
import DownloadManager from '@main/downloadManager'
import fs from 'fs'
import { ipcMainHandle, ipcMainSend } from '@main/utils/ipc-main'
import logger from '@main/utils/logger'

const storage = new Storage()
const coreLoader = new CoreLoader()

axios.defaults.adapter = require('axios/lib/adapters/http.js')

// TODO CHECK NO AVX

async function downloadFile (instance: AxiosInstance, url: string, targetPath: string, progressCallback): Promise<void> {
  const { data, headers } = await instance.get(url, { responseType: 'stream' })
  const contentLength = headers['content-length']
  let curLength = 0
  console.log('contentLength', contentLength)
  data.on('data', (chunk) => { curLength += chunk.length as number })
  setInterval(
    () => {
      progressCallback(curLength, contentLength)
    }, 2000
  )
  data.pipe(fs.createWriteStream(targetPath))
  data.on('close', () => { console.log('download en') })
}

interface PackageDetail {
  name: string
  checksum: string // not package zip md5, see #1345
  version: string
  url: string
}

const tempServer = 'github'
interface githubApiResponse {
  url: string
  assets: Array<{ name: string, browser_download_url: string }>
}

const mockRep = [
  {
    file_name: 'MaaBundle-Dev-2022-07-28-12-58-09-311518a.zip',
    package_type: 'DevBundle',
    file_hash: '8772022E2757B1CD91CEC23A710FBDBF',
    file_identity: '9F183E879AC2F001E28D87733C460EF6'
  }
]

type packageNameType = 'MaaBundle' | 'MaaCore' | 'MaaDependency' | 'MaaDependencyNoAvx' | 'MaaResource'

const packages = ['MaaBundle', 'MaaCore', 'MaaDependency', 'MaaDependencyNoAvx', 'MaaResource']

@Singleton
class CoreInstaller extends ComponentInstaller {
  public constructor () {
    super()
  }

  public async install (): Promise<void> {
    const coredir = coreLoader.libPath

    try {
      if (this.downloader_) {
        const downloadUrl = await this.checkUpdate()
        this.downloader_?.downloadComponent(downloadUrl, 'Maa Core')
        this.status_ = 'downloading'
      }
    } catch (e) {
      logger.error(e)
    }
  }

  public get status (): InstallerStatus {
    return this.status_
  }

  protected onStart (): void {

  }

  protected onProgress (progress: number): void {
    ipcMainSend('renderer.ComponentManager:updateStatus', {
      type: 'Maa Core',
      status: this.status_,
      progress
    })
  }

  protected onCompleted (): void {
    this.status_ = 'done'
    ipcMainSend('renderer.ComponentManager:installDone')
  }

  protected onException (): void {
    this.status_ = 'exception'
    ipcMainSend('renderer.ComponentManager:installInterrupted')
  }

  public readonly downloadHandle = {
    handleDownloadUpdate: (task: DownloadTask) => {
      this.onProgress(0.8 * (task.progress.precent ?? 0))
    },
    handleDownloadCompleted: (task: DownloadTask) => {
      this.status_ = 'unzipping'
      this.onProgress(0.8)
    },
    handleDownloadInterrupted: (task: DownloadTask) => {
      this.onException()
    }
  }

  public readonly unzipHandle = {

  }

  protected async checkUpdate (): Promise<string> {
    const url = 'https://api.github.com/repos/MaaAssistantArknights/MaaAssistantArknights/releases/latest'
    const response = await axios.get(url, {})
    const { assets } = response.data
    const dependency = assets.find((asset: any) => /^MaaDependency-v(.+)\.zip$/.test(asset.name))
    return dependency.browser_download_url
  }

  protected status_: InstallerStatus = 'pending'
  public downloader_: DownloadManager | null = null
}

// const ci = new CoreInstaller()

// function initHook (): void {
//   logger.debug('initHook')
//   ipcMainHandle('main.componentManager:getStatus', (event, args) => {
//     ci.getLocalVersion()
//   })
// }

// initHook()

export default CoreInstaller
