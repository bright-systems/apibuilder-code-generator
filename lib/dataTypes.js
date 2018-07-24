
exports.translateGraphQL = (dataType, enums = [], models = [], isInput = false) => {
  switch (dataType.toLowerCase()) {
    case 'boolean':
      return 'Boolean'
    case 'date-iso8601':
      return 'AWSDate'
    case 'date-time-iso8601':
      return 'AWSDateTime'
    case 'decimal':
      return 'Float'
    case 'double':
      return 'Float'
    case 'integer':
      return 'Int'
    case 'json':
      return 'AWSJSON'
    case 'long':
      return 'Int'
    case 'object':
      return 'AWSJSON'
    case 'string':
      return 'String'
    case 'uuid':
      return 'String' // TODO: Support true UUID. AppSync does not seem to support the `scalar` directive.
    default:
      const listMatch = dataType.match(/\[(.+)\]/)
      if (listMatch) {
        return '[' + exports.translateGraphQL(listMatch[1], enums, models, isInput) + ']'
      } else {
        const enumObj = enums.find(e => dataType === e.name)
        if (enumObj) {
          return enumObj.name
        } else {
          const modelObj = models.find(m => dataType === m.name)
          if (modelObj) {
            return modelObj.name + (isInput ? 'Input' : '')
          } else {
            return ''
          }
        }
      }
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
