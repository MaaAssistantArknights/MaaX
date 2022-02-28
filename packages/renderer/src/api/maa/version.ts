import service from "./service";

export default {
  async getPlatform(component: string) {
    return await service.get<string[]>("/version/getPlatform", {
      params: {
        component,
      },
    });
  },
  async getArch(platform: Api.Maa.Platform, component: string) {
    return await service.get<{
      platform: Api.Maa.Platform;
      support_arch: Api.Maa.Arch[];
    }>(`/version/${platform}/getArch`, {
      params: {
        component,
      },
    });
  },
  async getVersion(
    platform: Api.Maa.Platform,
    arch: Api.Maa.Arch,
    page: number,
    component: string
  ) {
    return await service.get<{
      platform: Api.Maa.Platform;
      arch: Api.Maa.Arch;
      versions: Array<Api.Maa.VersionMetadata>;
    }>(`/version/${platform}/${arch}/getVersion`, {
      params: {
        page,
        component,
      },
    });
  },
  async getVersionInfo(
    platform: Api.Maa.Platform,
    arch: Api.Maa.Arch,
    version: string,
    component: string
  ) {
    return await service.get<{
      platform: Api.Maa.Platform;
      arch: Api.Maa.Arch;
      version_metadata: Api.Maa.VersionDetail
    }>(`/version/${platform}/${arch}/${version}`, {
      params: {
        component,
      },
    });
  },
};
