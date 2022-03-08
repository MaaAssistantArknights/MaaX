import * as Stage from './stage';
import * as Zone from './zone';

import type { StageType } from './stage';
import type { ZoneType } from './zone';

export interface PenguinStatsTypes {
  StageType: StageType;
  ZoneType: ZoneType;
}

export default {
  Stage,
  Zone,
};
