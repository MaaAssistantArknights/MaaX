import request from 'renderer/utils/request/penguin-stats';

export type StageType = {
  stageType: string;
  stageId: string;
  zoneId: string;
  code: string;
  apCost: number;
  existence?: {
    US: {
      exist: boolean;
      openTime?: number;
      closeTime?: number;
    };
    CN: {
      exist: boolean;
      openTime?: number;
      closeTime?: number;
    };
    JP: {
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
  minClearTime: number;
  code_i18n: {
    ko: string;
    ja: string;
    en: string;
    zh: string;
  };
};

export async function GetAllStages(): Promise<StageType[]> {
  const response = await request.get('/stages');
  if (response && response.status === 200) {
    return response.data;
  }
  return [];
}

export async function GetStageById(stageId: string): Promise<StageType | null> {
  const response = await request.get(`/stages/${stageId}`);
  if (response && response.status === 200) {
    return response.data;
  }
  return null;
}
