// JSON schema used to validate tags options.
const tagsSchema = {
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

export default {
  type: 'object',
  properties: {
    pages: {
      type: 'array',
      items: {
        type: 'string',
        pattern: '\.html$', // eslint-disable-line no-useless-escape
      },
    },
    tags: tagsSchema,
  },
  required: ['tags'],
};
