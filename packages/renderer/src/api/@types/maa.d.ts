declare namespace Api.Maa {
  type Platform = "windows" | "macos" | "linux" | "NoPlatform";
  type Arch = "x64" | "arm64" | "NoArch";
  type Component = ""; // TODO: MaaDS Component

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

  type GameServers = "cn" | "us" | "jp" | "kr";
  type GameLocales = "zh" | "en" | "ja" | "ko";
  type StageType = "MAIN" | "SUB" | "ACTIVITY" | "DAILY";
  type ZoneType = "MAINLINE";

  type StageMetadata = {
    stage_id: string;
    stage_type: StageType;
    stage_code: string;
    stage_ap_cost: number;
  };

  type ZoneMetadata = {
    zone_id: string;
    zone_name: string;
    zone_type: ZoneType;
  };

  type Stage = {
    stage_metadata: StageMetadata;
    zone_metadata: ZoneMetadata;

    existence?: {
      [K in GameServers]: {
        exist: boolean;
        openTime: number | null;
        closeTime: number | null;
      };
    };
    zone_i18n: {
      [K in GameLocales]: string;
    };
    stage_i18n: {
      [K in GameLocales]: string;
    };
  };

  type Zone = {
    zone_metadata: ZoneMetadata;
    existence?: {
      [K in GameServers]: {
        exist: boolean;
        openTime: number | null;
        closeTime: number | null;
      };
    };
    zone_i18n: {
      [K in GameLocales]: string;
    };
    stages: StageMetadata[];
  }

  type Item = {
    
  }
}
