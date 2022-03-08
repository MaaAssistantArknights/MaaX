const schema = {
  type: 'object',
  properties: {
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
      required: ['3 Stars', '4 Stars', '5 Stars'],
      additionalProperties: false,
    },
  },
  required: [
    'NormalTagRefreshing',
    'UseExpeditedPlan',
    'MaximumNumberOfRecruitments',
    'recognitions',
  ],
  additionalProperties: false,
};

export default schema;

export type Type = {
  NormalTagRefreshing: boolean;
  UseExpeditedPlan: boolean;
  MaximumNumberOfRecruitments: number;
  recognitions: {
    [props: string]: boolean;
    '3 Stars': boolean;
    '4 Stars': boolean;
    '5 Stars': boolean;
  };
};
