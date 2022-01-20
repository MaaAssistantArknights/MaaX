import type { StageType } from 'renderer/api/penguin-stats/stage';
import type { ZoneType } from 'renderer/api/penguin-stats/zone';

const lastBattle: StageType = {
  stageType: 'CUSTOM',
  stageId: 'lastBattle',
  zoneId: 'CUSTOM',
  code: '上次作战',
  apCost: 50,
  minClearTime: 63700,
  code_i18n: {
    en: 'lastBattle',
    ja: 'lastBattle',
    ko: 'lastBattle',
    zh: 'lastBattle',
  },
};

const cuttentStage: StageType = {
  stageType: 'CUSTOM',
  stageId: '',
  zoneId: 'CUSTOM',
  code: '当前关卡',
  apCost: 50,
  minClearTime: 63700,
  code_i18n: {
    en: 'currentStage',
    ja: 'currentStage',
    ko: 'currentStage',
    zh: 'currentStage',
  },
};

const customZone: ZoneType = {
  zoneId: 'CUSTOM',
  zoneIndex: 0,
  type: 'CUSTOM',
  zoneName: '自定义',
  stages: ['lastBattle', 'currentStage'],
  background: 'unknown',
  zoneName_i18n: {
    en: 'CUSTOM',
    ja: 'CUSTOM',
    ko: 'CUSTOM',
    zh: 'CUSTOM',
  },
};

export { lastBattle, cuttentStage, customZone };
