const Pluralize = require('pluralize')

exports.toClassName = name => {
  return (name || '').replace(/[\W_]/g, ' ').replace(/([A-Z])/g, ' $1').split(/\s+/).map(function(word) { return word.toLowerCase().replace(/^(.)(.*)/, function(m, c1, c2) { return c1.toUpperCase() + c2 }) }).join('')
}

exports.toMethodName = name => {
  return exports.toClassName(name).replace(/^(.)(.*)/, function(m, c1, c2) { return c1.toLowerCase() + c2 })
}

exports.toPlural = name => {
  Pluralize.addSingularRule('skus', 'sku')
  if (Pluralize.isSingular(name)) {
    return Pluralize.plural(name)
  } else {
    return name
  }
}

exports.toSingular = name => {
  Pluralize.addSingularRule('skus', 'sku')
  if (Pluralize.isSingular(name)) {
    return name
  } else {
    return Pluralize.singular(name)
  }
}

exports.toSnakeCase = (str, delimiter) => {
  if (delimiter === undefined || (typeof delimiter) !== 'string') delimiter = '_'
  return (str || '').replace(/[\W_]/g, ' ').replace(/([A-Z])/g, ' $1').toLowerCase().trim().replace(/\s+/g, delimiter)
}
