/* eslint-disable vue/max-len */
import _ from 'lodash'
import { app, ipcMain, net } from 'electron'
import axios, { AxiosInstance } from 'axios'

import { Singleton } from '@common/function/singletonDecorator'

import CoreLoader from '@main/coreLoader'

import ComponentInstaller from '../componentInstaller'
import Storage from '@main/storageManager'
import fs from 'fs'
import { ipcMainHandle, ipcMainSend } from '@main/utils/ipc-main'

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
  assets: Array<{name: string, browser_download_url: string}>
}

const mockRep = [
  {
    file_name: 'MaaBundle-Dev-2022-07-28-12-58-09-311518a.zip',
    package_type: 'DevBundle',
    file_hash: '8772022E2757B1CD91CEC23A710FBDBF',
    file_identity: '9F183E879AC2F001E28D87733C460EF6'
  }
]

type packageNameType = 'MaaBundle' | 'MaaCore' | 'MaaDependency' | 'MaaDependencyNoAvx' |'MaaResource'

const packages = ['MaaBundle', 'MaaCore', 'MaaDependency', 'MaaDependencyNoAvx', 'MaaResource']

@Singleton
class CoreInstaller extends ComponentInstaller {
  private static packages: any
  private static instance: AxiosInstance

  public constructor () {
    super()
    CoreInstaller.packages = {}
    packages.forEach((pkg) => {
      CoreInstaller.packages[pkg] = {
        name: pkg,
        version: 0,
        url: '',
        checksum: ''
      }
    })

    CoreInstaller.instance = axios.create({
      // baseURL: CoreInstaller.sources[tempServer].url,
      headers: { 'User-Agent': CoreInstaller.UA },
      method: 'GET',
      timeout: 5000
    })
  }

  private static readonly sources = {
    github: {
      url: 'https://api.github.com/repos/MaaAssistantArknights/MaaAssistantArknights/releases/latest',
      data: '',
      parse: async (data: githubApiResponse): Promise<boolean> => {
        const checksum = data.assets.find((v) => v.name === 'checksum.json')
        if (checksum) {
          await downloadFile(CoreInstaller.instance, 'https://github.com/MaaAssistantArknights/MaaAssistantArknights/releases/download/v4.2.1/MaaBundle-v4.2.1.zip', 'F:/check.json', (current, total) => {
            console.log('progress ', (current / total) * 100, '%')
            const progress = Math.ceil((current / total) * 100)
            ipcMainSend('renderer.DownloadModel:updateStatus', {
              type: 'core',
              data: {
                text: `正在下载${progress}%`,
                progress: Math.ceil((current / total) * 100)
              }
            })
          })
          return true // parse checksum.json end
        } else {
          return false // no package meta data
        }
      },
      checkUpdate: async () => {

      }
    },
    maads: {
      url: '',
      parse: (response) => {}
    }

  }

  private static readonly coreList = ['MaaCore', 'MaaDependency', 'MaaResource']
  private static readonly checksum = 'checksum.txt'
  private releaseInfo: Object

  public getLocalVersion () {
    const v = {}
    CoreInstaller.coreList.forEach((pkg) => {
      v[pkg] = storage.get(`version.${pkg}`)
    })
    return v
  }

  public async fetchRaw (url: string): Promise<void> {
    const response = await axios.get(url)
    this.releaseInfo = response.data
  }

  public async install (): Promise<void> {
    const tempdir = app.getPath('temp')
    const coredir = coreLoader.libPath
  }

  public get status (): InstallerStatus {
    return this.status_
  }

  protected onStart (): void {

  }

  protected onProgress (progress: number): void {

  }

  protected onException (): void {

  }

  protected async checkUpdate (): Promise<void> {
    await CoreInstaller.instance.get('https://api.github.com/repos/MaaAssistantArknights/MaaAssistantArknights/releases/latest').then(
      async (response) => {
        // TODO: catch error
        await CoreInstaller.sources[tempServer].parse(response.data)
        CoreInstaller.sources[tempServer].checkUpdate()
      }
    ).catch((error) => {
      console.log(error)
    })
  }

  protected status_: InstallerStatus = 'pending'
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
