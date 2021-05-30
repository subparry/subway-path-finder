const networkSchema = {
  type: 'object',
  properties: {
    author: {
      type: 'string',
    },
    networkName: {
      type: 'string',
    },
    stations: {
      type: 'object',
      patternProperties: {
        '^.*$': {
          type: 'object',
          required: ['linkedWith'],
          properties: {
            color: {
              type: 'string',
            },
            linkedWith: {
              type: 'array',
              minItems: 1,
              items: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  },
}

module.exports = networkSchema
