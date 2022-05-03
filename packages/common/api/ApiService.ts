import SuperAgent from 'superagent'
import pkg from '../../../package.json'

console.log(globalThis.window)

const getCoreVersion = async (): Promise<string> => {
  if (globalThis.window) {
    const version = await (window.ipcRenderer.invoke('version:core') as Promise<string>)
    return version ? `(core v${version})` : '(without core)'
  } else {
    const { Assistant } = await import('../../main/coreLoader')
    const version = Assistant.getInstance()?.GetVersion()
    return version ? `(core v${version})` : '(without core)'
  }
}

const getUiVersion = (): string => pkg.version

class ApiService {
  constructor (baseUrl?: string) {
    this._baseUrl = baseUrl
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async get<T>(url: string, params: Record<string, any> = {}): Promise<T | Error> {
    try {
      const response = await SuperAgent
        .get(`${this._baseUrl ?? ''}${url}`)
        .query(params)
        .set('Client-Version', `MeoAssistantArknights v${getUiVersion()} ${await getCoreVersion()}`)
      return response.body as T
    } catch (error) {
      return new Error(error)
    }
  }

  get baseUrl (): string | undefined {
    return this._baseUrl
  }

  private readonly _baseUrl: string | undefined
}

export default ApiService
