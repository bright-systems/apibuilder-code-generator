const nameHelper = require('./nameHelpers')

exports.allRequestFields = (operation, models, delimiter, options) => {
  const fields = {}
  if (operation.body) {
    const bodyModel = models.find(m => m.name === operation.body.type)
    if (bodyModel) {
      bodyModel.fields.forEach(field => { fields[field.name] = field })
    }
  }
  operation.parameters.forEach(param => { fields[param.name] = param })
  return Object.keys(fields).map(key => fields[key]).sort((a, b) => {
    if (a.name < b.name) {
      return -1
    } else if (a.name > b.name) {
      return 1
    } else {
      return 0
    }
  }).map(field => options.fn(field)).join(delimiter)
}

exports.eachSubModel = (dataType, service, opts) => {
  const modelObj = service.models.find(m => dataType === m.name)
  const resourceModelTypes = service.resources.map(r => r.type)
  if (modelObj && modelObj.fields.length > 1) { // the second check is to skip models that represent a simple array as a one-property object
    return modelObj.fields.map(field => {
      const subModelObj = service.models.find(m => (field.type === m.name || field.type === '[' + m.name + ']') && resourceModelTypes.includes(m.name))
      if (subModelObj) {
        const isArray = (field.type.replace(/^\[/, '').replace(/\]$/, '') !== field.type)
        subModelObj._meta_ = {
          fieldName: field.name,
          isArray
        }
        return opts.fn(subModelObj)
      }
    }).join('')
  }
}

exports.hasOperation = (operations, method, opts) => {
  const operation = operations.find(op => op.method.toLowerCase() === method.toLowerCase())
  if (operation) {
    return opts.fn(operation)
  } else {
    return opts.inverse(this)
  }
}

exports.isModel = (field, models, opts) => {
  const model = models.find(m => m.name === field.type || '[' + m.name + ']' === field.type)
  if (model) {
    return opts.fn(model)
  } else {
    return opts.inverse(this)
  }
}

exports.operationToUniqueName = (operation) => {
  const pathParams = operation.parameters.filter(param => param.location.toLowerCase() === 'path').map(param => nameHelper.toClassName(param.name))
  const components = [operation.method.toLowerCase()]
  if (pathParams.length > 0) {
    components.push('by')
    components.push(pathParams.join(' and '))
  }
  return nameHelper.toClassName(components.join(' '))
}

exports.pathToSwagger = path => {
  return path.replace(/:([^/]+)/g, '{$1}')
}

exports.successResponseType = (responses, models, opts) => {
  const success = responses.find(r => r.code.integer && r.code.integer.value && r.code.integer.value >= 200 && r.code.integer.value <= 299)
  if (success) {
    // Note: Cannot use array responses here; must wrap arrays into their own type.
    // i.e. not [User] but instead Users: { parameters: users: [User] }
    const successType = models.find(m => m.name === success.type)
    return opts.fn(successType)
  } else {
    return opts.inverse(this)
  }
}
