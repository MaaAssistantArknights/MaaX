import service from "./service";

export default {
  async getCompletePackage(
    platform: Api.Maa.Platform,
    arch: Api.Maa.Arch,
    version: string,
    component: Api.Maa.Component
  ) {
    return await service.get<{
      platform: Api.Maa.Platform;
      arch: Api.Maa.Arch[];
      version: string;
      url: string;
      hash: string;
    }>(`/download/${platform}/${arch}/${version}`, {
      params: {
        component,
      },
    });
  },
  async getDiffPackage(platform: Api.Maa.Platform,
    arch: Api.Maa.Arch,
    from: string,
    to: string,
    component: Api.Maa.Component
  ) {
    return await service.get<{
      platform: Api.Maa.Platform;
      arch: Api.Maa.Arch[];
      version: string;
      url: string;
      hash: string;
    }>(`/download/${platform}/${arch}`, {
      params: {
        component,
        from, to
      },
    });
  }
};