const schema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
  },
  additionalProperties: false,
};

export default schema;

export type Type = {
  id?: number;
};
