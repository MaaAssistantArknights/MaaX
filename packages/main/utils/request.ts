import { net } from 'electron'
import type { ClientRequestConstructorOptions } from 'electron'

export const get = (options: ClientRequestConstructorOptions) => {
  return net.request({ ...options, method: 'GET' })
}

export const post = (options: ClientRequestConstructorOptions) => {
  return net.request({ ...options, method: 'POST' })
}

export const put = (options: ClientRequestConstructorOptions) => {
  return net.request({ ...options, method: 'PUT' })
}

export const del = (options: ClientRequestConstructorOptions) => {
  return net.request({ ...options, method: 'DELETE' })
}
