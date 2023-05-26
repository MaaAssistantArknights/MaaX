import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import _ from 'lodash'
import useSettingStore from '@/store/settings'

const getUA = (): string => {
  const settingStore = useSettingStore()
  const coreVersion = settingStore.version.core.current
  const uiVersion = `v${settingStore.version.ui.current ?? ''}`
  const versionString = coreVersion ? `(core ${coreVersion})` : '(without core)'
  return `MAAX ${uiVersion} ${versionString}`
}

class ApiService {
  constructor(baseUrl: string) {
    this._instance = axios.create({
      baseURL: baseUrl,
      timeout: 5000,
    })

    this._instance.interceptors.request.use(
      async request => {
        request.headers = {
          ...request.headers,
        }
        const isInDev = await window.ipcRenderer.invoke('main.Util:isInDev')
        if (!isInDev) {
          request.headers['User-Agent'] = getUA()
        }
        return request
      },
      async error => {
        return await Promise.resolve(new Error(error))
      }
    )

    this._instance.interceptors.response.use(
      response => {
        return response
      },
      async error => {
        return await Promise.resolve(new Error(error))
      }
    )
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    const response = await this._instance.get(url, config)
    if (_.isError(response)) {
      throw response
    }
    return response
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    const response = await this._instance.post(url, data, config)
    if (_.isError(response)) {
      throw response
    }
    return response
  }

  get baseUrl(): string | undefined {
    return this._instance.defaults.baseURL
  }

  private readonly _instance: AxiosInstance
}

export default ApiService
