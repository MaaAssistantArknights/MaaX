declare namespace Api.Maa {
  type Platform = "windows" | "macos" | "linux";
  type Arch = "x64" | "arm64";

  interface Resource {
    file_name: string;
    path: string;
    hash: string;
  }

  interface DownloadUrl {
    version: string;
    platform: string;
    arch: string;
    url: string;
    hash: string;
  }

  interface VersionMetadata {
    publish_time: string;
    version: string;
  }

  interface VersionDetail {
    publish_time: string;
    version: string;
    update_log: string;
    resources: Array<Resource>;
  }
}
