import type { Arch, Component, Platform } from '@type/api/maa'

import service from './service'

export default {
  async getCompletePackage(platform: Platform, arch: Arch, version: string, component: Component) {
    return await service.get<{
      platform: Platform
      arch: Arch[]
      version: string
      url: string
      hash: string
    }>(`/download/${platform}/${arch}/${version}`, {
      params: {
        component,
      },
    })
  },
  async getDiffPackage(
    platform: Platform,
    arch: Arch,
    from: string,
    to: string,
    component: Component
  ) {
    return await service.get<{
      platform: Platform
      arch: Arch[]
      version: string
      url: string
      hash: string
    }>(`/download/${platform}/${arch}`, {
      params: {
        component,
        from,
        to,
      },
    })
  },
}
