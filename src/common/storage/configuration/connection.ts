const schema = {
  type: 'object',
  properties: {
    address: { type: 'string' },
    'Filepath of bluestack.conf': { type: 'string' },
  },
  additionalProperties: false,
};

export default schema;

export type Type = {
  address?: string;
  'Filepath of bluestack.conf'?: string;
};
