import SuperAgent from 'superagent'
import axios, { AxiosAdapter, AxiosInstance } from 'axios'
import pkg from '../../../package.json'

const getCoreVersion = async (): Promise<string> => {
  if (typeof XMLHttpRequest === 'undefined') {
    const { Assistant } = await import('../../main/coreLoader')
    const version = Assistant.getInstance()?.GetVersion()
    return version ? `(core v${version})` : '(without core)'
  } else {
    const version = await (window.ipcRenderer.invoke('version:core') as Promise<string>)
    return version ? `(core v${version})` : '(without core)'
  }
}

const getUiVersion = (): string => pkg.version

const getAdapter = (): AxiosAdapter => {
  if (typeof XMLHttpRequest === 'undefined') {
    return require('axios/lib/adapters/http')
  } else {
    return require('axios/lib/adapters/xhr')
  }
}

class ApiService {
  constructor (baseUrl?: string) {
    this._baseUrl = baseUrl
    this._instance = axios.create({
      baseURL: baseUrl,
      timeout: 5000,
      adapter: getAdapter()
    })
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async get<T>(url: string, params: Record<string, any> = {}): Promise<T | Error> {
    try {
      const response = this._instance.get(`${this._baseUrl ?? ''}${url}`, {
        headers: {
          'Client-Version': `MeoAssistantArknights v${getUiVersion()} ${await getCoreVersion()}`
        },
        params
      })
      // const response = await SuperAgent
      //   .get()
      //   .query(params)
      //   .set('Client-Version', `MeoAssistantArknights v${getUiVersion()} ${await getCoreVersion()}`)
      return response.body as T
    } catch (error) {
      return new Error(error)
    }
  }

  get baseUrl (): string | undefined {
    return this._baseUrl
  }

  private readonly _baseUrl: string | undefined
  private readonly _instance: AxiosInstance
}

export default ApiService
