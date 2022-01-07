const schema = {
  type: 'object',
  properties: {
    enable: {
      type: 'object',
      properties: {
        ManufacturingStation: { type: 'boolean' },
        TradingStation: { type: 'boolean' },
        ControlCenter: { type: 'boolean' },
        PowerStation: { type: 'boolean' },
        MeetingRoom: { type: 'boolean' },
        Office: { type: 'boolean' },
        Dormitory: { type: 'boolean' },
      },
      required: [
        'ManufacturingStation',
        'TradingStation',
        'ControlCenter',
        'PowerStation',
        'MeetingRoom',
        'Office',
        'Dormitory',
      ],
      additionalProperties: false,
    },
    DroneUsage: { enum: ['Manufacturing Station', 'Trading Station'] },
    MoodLimit: { type: 'integer', minimum: 0, exclusiveMaximum: 24 },
  },
  required: ['enable', 'DroneUsage', 'MoodLimit'],
  additionalProperties: false,
};

export default schema;

export type Type = {
  enable: {
    [props: string]: boolean;
    ManufacturingStation: boolean;
    TradingStation: boolean;
    ControlCenter: boolean;
    PowerStation: boolean;
    MeetingRoom: boolean;
    Office: boolean;
    Dormitory: boolean;
  };
  DroneUsage: 'Manufacturing Station' | 'Trading Station';
  MoodLimit: number;
};
