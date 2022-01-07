const schema = {
  NormalTagRefreshing: { type: 'boolean' },
  UseExpeditedPlan: { type: 'boolean' },
  MaximumNumberOfRecruitments: { type: 'integer', minimum: 0 },
  recognitions: {
    type: 'object',
    properties: {
      '3 Stars': { type: 'boolean' },
      '4 Stars': { type: 'boolean' },
      '5 Stars': { type: 'boolean' },
      // '6 Stars': { type: 'boolean' },
    },
  },
};

export default schema;
