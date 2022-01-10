const schema = {
  type: 'object',
  properties: {
    enable: { type: 'boolean' },
  },
  required: ['enable'],
  additionalProperties: false,
};

export default schema;

export type Type = {
  enable: boolean;
};
