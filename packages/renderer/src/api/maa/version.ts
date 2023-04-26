import service from './service'

export default {
  async getVersion(
    platform: Api.Maa.Platform,
    arch: Api.Maa.Arch,
    version: string,
    component: Api.Maa.Component
  ) {
    return await service.get<{
      platform: Api.Maa.Platform
      arch: Api.Maa.Arch
      version_metadata: Api.Maa.VersionDetail
    }>(`/version/${platform}/${arch}/${version}`, {
      params: {
        component,
      },
    })
  },
}
