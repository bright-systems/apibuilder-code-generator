const dataTypes = require('./dataTypes')
const nameHelpers = require('./nameHelpers')

exports.columnDefinition = (field, enums) => {
  const { dataType, matchedEnum } = dataTypes.translatePostgres(field.type, enums)
  if (dataType) {
    var definition = dataType
    if (matchedEnum) definition += ` references ${exports.toTableName(matchedEnum.plural)}`
    if (field.required) definition += ' not null'
    if (field.default) definition += ` default ${exports.embedValue(field.default, dataType)}`
    return definition
  } else {
    console.warn(`${field.name}[${field.type}] cannot be translated.`)
  }
}

exports.embedValue = (value, dataType) => {
  switch (dataType) {
    case 'bigint':
    case 'boolean':
    case 'integer':
    case 'numeric':
      return value
    case 'date':
    case 'timestamptz':
    case 'text':
    case 'uuid':
      return `'${value.replace('\'', '\'\'')}'`
    case 'json':
      return `'${JSON.stringify(value).replace('\'', '\'\'')}'`
  }
}

exports.toTableName = name => {
  return nameHelpers.toPlural(nameHelpers.toSnakeCase(name))
}
