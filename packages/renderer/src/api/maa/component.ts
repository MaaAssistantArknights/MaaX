import type { Arch, Component, Platform } from '@type/api/maa'

import service from './service'

interface ComponentInfo {
  name: string
  description: string
  versions: Array<{
    version: string
    publish_time: string
    update_log: string
    support: Array<{
      platform: Platform
      arch: Arch
    }>
  }>
  page: number
  limit: number
}

export default {
  async getAll() {
    return await service.get<ComponentInfo[]>('/component/getAll')
  },
  async getInfo(component: Component) {
    return await service.get<ComponentInfo>('/component/getInfo', {
      params: {
        component,
      },
    })
  },
}
