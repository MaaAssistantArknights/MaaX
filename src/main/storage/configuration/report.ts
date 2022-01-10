const schema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
  },
  additionalProperties: false,
};

export default schema;

export type Type = {
  id?: string;
};
