import service from './service'

interface ComponentInfo {
  name: string
  description: string
  versions: Array<{
    version: string
    publish_time: string
    update_log: string
    support: Array<{
      platform: Api.Maa.Platform
      arch: Api.Maa.Arch
    }>
  }>
  page: number
  limit: number
}

export default {
  async getAll () {
    return await service.get<ComponentInfo[]>('/component/getAll')
  },
  async getInfo (
    component: Api.Maa.Component
  ) {
    return await service.get<ComponentInfo>('/component/getInfo', {
      params: {
        component
      }
    })
  }
}
