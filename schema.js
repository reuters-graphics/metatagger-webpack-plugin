// JSON schema used to validate tags options.
export default {
  type: 'object',
  patternProperties: {
    '.*': {
      type: 'object',
      patternProperties: {
        '.*': {
          type: 'array',
          items: {
            type: 'object',
            patternProperties: {
              '.*': {
                type: 'string',
              },
            },
          },
        },
      },
    },
  },
};
