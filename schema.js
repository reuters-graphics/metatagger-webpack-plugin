// JSON schema used to validate tags options.
module.exports = {
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
