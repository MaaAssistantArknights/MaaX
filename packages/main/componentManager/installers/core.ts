import _ from 'lodash'
import { app } from 'electron'
import axios from 'axios'

import { Singleton } from '@common/function/singletonDecorator'

import CoreLoader from '@main/coreLoader'
import { downloadFile } from '@main/utils/downloader'

import ComponentInstaller from '../componentInstaller'
import Storage from '@main/storageManager'

const storage = new Storage()
const coreLoader = new CoreLoader()

axios.defaults.adapter = require('axios/lib/adapters/http.js')

// TODO CHECK NO AVX
interface Package {
  checksum: string
  version: string
  url: string
  type: 'stable' | 'dev'
}
interface VersionInfo {
  bundle: Package
  core: Package
  dependency: Package
  resource: Package
}

const tempServer = 'github'
interface githubApiResponse {
  url: string
  assets: Array<{name: string, browser_download_url: string}>
}

@Singleton
class CoreInstaller extends ComponentInstaller {
  private static readonly methods = {
    github: {
      url: 'https://api.github.com/repos/MaaAssistantArknights/MaaAssistantArknights/releases/latest',
      parse: (response: githubApiResponse) => {
        console.log(response.url)
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

  public async fetchRaw (url: string): Promise<void> {
    const response = await axios.get(url)
    this.releaseInfo = response.data
  }

  public async install (url: string): Promise<void> {
    const tempdir = app.getPath('temp')
    const coredir = coreLoader.libPath
    downloadFile({
      url,
      path: tempdir,
      displayName: 'MaaCore',
      onProgress: this.onProgress
    })
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
    const instance = axios.create({
      baseURL: CoreInstaller.methods[tempServer].url,
      headers: { 'User-Agent': CoreInstaller.UA },
      timeout: 5000
    })
    await instance.get('').then(
      (response) => {
        // TODO: catch error
        CoreInstaller.methods[tempServer].parse(response.data)
      }
    ).catch((error) => {
      console.log(error)
    })
  }

  protected status_: InstallerStatus = 'pending'
}

export default CoreInstaller
