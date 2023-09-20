import type { Arch, Component, Platform, VersionDetail } from '@type/api/maa'

import service from './service'

export default {
  async getVersion(platform: Platform, arch: Arch, version: string, component: Component) {
    return await service.get<{
      platform: Platform
      arch: Arch
      version_metadata: VersionDetail
    }>(`/version/${platform}/${arch}/${version}`, {
      params: {
        component,
      },
    })
  },
}
