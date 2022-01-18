export default {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      label: { type: 'string' },
      value: { type: 'string' },
      enabled: { type: 'boolean' },
    },
    required: ['label', 'value', 'enabled'],
    additionalProperties: false,
  },
};

export type Type = Array<{
  label: string;
  value: string;
  enabled: boolean;
}>;
