import type { AxiosRequestConfig } from 'axios'

export interface ApiServiceProvider {
  get: <T>(url: string, config?: AxiosRequestConfig) => Promise<T | Error>
}
