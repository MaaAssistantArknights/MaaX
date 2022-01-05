import request from 'renderer/utils/request/penguin-stats';

export type ZoneType = {
  zoneId: string;
  zoneIndex: number;
  type: 'ACTIVITY' | 'WEEKLY' | 'MAINLINE' | 'ACTIVITY_PERMANENT' | 'GACHABOX';
  subType?: string;
  zoneName: string;
  existence?: {
    US: {
      exist: boolean;
      openTime?: number;
      closeTime?: number;
    };
    JP: {
      exist: boolean;
      openTime?: number;
      closeTime?: number;
    };
    CN: {
      exist: boolean;
      openTime?: number;
      closeTime?: number;
    };
    KR: {
      exist: boolean;
      openTime?: number;
      closeTime?: number;
    };
  };
  stages: string[];
  background: string;
  zoneName_i18n: {
    ko: string;
    ja: string;
    en: string;
    zh: string;
  };
};

export async function GetAllZones(): Promise<ZoneType[]> {
  const response = await request.get('/zones');
  if (response && response.status === 200) {
    return response.data;
  }
  return [];
}

export async function GetZoneById(zoneId: string): Promise<ZoneType | null> {
  const response = await request.get(`/zones/${zoneId}`);
  if (response && response.status === 200) {
    return response.data;
  }
  return null;
}
