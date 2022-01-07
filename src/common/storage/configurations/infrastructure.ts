const schema = {
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
  },
  DroneUsage: { enum: ['Manufacturing Station', 'Trading Station'] },
  MoodLimit: { type: 'integer', minimum: 0, exclusiveMaximum: 24 },
};

export default schema;
