const schema = {
  type: 'object',
  properties: {
    facilities: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            pattern:
              '[(ManufacturingStation)|(TradingStation)|(ControlCenter)|(PowerStation)|(MeetingRoom)|(Office)|(Dormitory)]',
          },
          enabled: { type: 'boolean' },
        },
        required: ['name', 'enabled'],
      },
      uniqueItems: true,
    },
    DroneUsage: {
      enum: [
        'None',
        'LMD',
        'Orumdum',
        'Battle Record',
        'Pure Gold',
        'Originium Shared',
        'Chip',
      ],
    },
    MoodLimit: { type: 'number', minimum: 0, exclusiveMaximum: 1 },
  },
  required: ['facilities', 'DroneUsage', 'MoodLimit'],
  additionalProperties: false,
};

export default schema;

export type Type = {
  facilities: Array<{
    name: string;
    enabled: boolean;
  }>;
  DroneUsage: string;
  MoodLimit: number;
};
