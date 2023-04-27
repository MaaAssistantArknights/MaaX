import service from './service'
import type { Platform, Arch, Component, VersionDetail } from '@type/api/maa'

export default {
  async getVersion(
    platform: Platform,
    arch: Arch,
    version: string,
    component: Component
  ) {
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
