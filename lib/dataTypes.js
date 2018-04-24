
exports.translateGraphQL = (dataType) => {
  // TODO: Add Apollo scalars here: https://www.apollographql.com/docs/graphql-tools/scalars.html
  switch (dataType.toLowerCase()) {
    case 'boolean':
      return 'Boolean'
    // case 'date-iso8601':
    //   return { dataType: 'date' }
    // case 'date-time-iso8601':
    //   return { dataType: 'timestamptz' }
    case 'decimal':
      return 'Float'
    case 'double':
      return 'Float'
    case 'integer':
      return 'Int'
    // case 'json':
    //   return { dataType: 'json' }
    case 'long':
      return 'Int'
    // case 'object':
    //   return { dataType: 'text' }
    case 'string':
      return 'String'
    // case 'uuid':
    //   return { dataType: 'uuid' }
    default:
      return ''
  }
}

exports.translatePostgres = (dataType, enums = []) => {
  switch (dataType.toLowerCase()) {
    case 'boolean':
      return { dataType: 'boolean' }
    case 'date-iso8601':
      return { dataType: 'date' }
    case 'date-time-iso8601':
      return { dataType: 'timestamptz' }
    case 'decimal':
      return { dataType: 'numeric' }
    case 'double':
      return { dataType: 'numeric' }
    case 'integer':
      return { dataType: 'integer' }
    case 'json':
      return { dataType: 'json' }
    case 'long':
      return { dataType: 'bigint' }
    case 'object':
      return { dataType: 'text' }
    case 'string':
      return { dataType: 'text' }
    case 'uuid':
      return { dataType: 'uuid' }
    default:
      const enumObj = enums.find(e => dataType === e.name)
      if (enumObj) {
        return { dataType: 'text', matchedEnum: enumObj }
      } else {
        return {}
      }
  }
}
