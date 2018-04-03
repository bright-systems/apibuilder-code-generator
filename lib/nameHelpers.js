const Pluralize = require('pluralize')

exports.toClassName = name => {
  return name.replace(/[\W_]/g, ' ').split(/\s+/).map(function(word) { return word.toLowerCase().replace(/^(.)(.*)/, function(m, c1, c2) { return c1.toUpperCase() + c2 }) }).join('')
}

exports.toMethodName = name => {
  return exports.toClassName(name).replace(/^(.)(.*)/, function(m, c1, c2) { return c1.toLowerCase() + c2 })
}

exports.toPlural = name => {
  if (Pluralize.isSingular(name)) {
    return Pluralize.plural(name)
  } else {
    return name
  }
}

exports.toSnakeCase = (str, delimiter) => {
  if (delimiter === undefined || (typeof delimiter) !== 'string') delimiter = '_'
  return str.replace(/[\W_]/g, ' ').toLowerCase().trim().replace(/\s+/, delimiter)
}
