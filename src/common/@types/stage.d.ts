type StageType = {
  stageId: string;
  zoneName: string;
  stageName: string;
  times: number;
  sanityCost: number;
};

type DynamicStageType = {
  stageId?: string;
  zoneName?: string;
  stageName?: string;
  sanityCost?: number;
  times: number;
  type: 'last' | 'current';
};
