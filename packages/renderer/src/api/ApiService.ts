import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import version from '@/hooks/caller/version'
import _ from 'lodash'

const getCoreVersion = () => {
  const coreVersion = version.core()
  return coreVersion ? `(core v${coreVersion})` : '(without core)'
}

class ApiService {
  constructor (baseUrl: string) {
    this._instance = axios.create({
      baseURL: baseUrl,
      timeout: 5000,
      headers: {
        'Client-Version': ApiService._ua
      }
    })

    this._instance.interceptors.request.use(
      (request) => {
        return request
      },
      async (error) => {
        return await Promise.resolve(new Error(error))
      }
    )

    this._instance.interceptors.response.use(
      (response) => {
        return response
      },
      async (error) => {
        return await Promise.resolve(new Error(error))
      }
    )
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T | Error> {
    const response = await this._instance.get(url, config)
    if (_.isError(response)) {
      return response
    }
    return response.data
  }

  get baseUrl () {
    return this._instance.defaults.baseURL
  }

  static updateUA = () => {
    ApiService._ua = `MeoAssistantArknights v${version.ui()} ${getCoreVersion()}`
  };

  private readonly _instance: AxiosInstance;
  private static _ua: string = `MeoAssistantArknights v${version.ui()} ${getCoreVersion()}`;
}

export default ApiService
