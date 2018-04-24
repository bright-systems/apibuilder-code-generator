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

exports.hasOperation = (operations, method, opts) => {
  const operation = operations.find(op => op.method.toLowerCase() === method.toLowerCase())
  if (operation) {
    return opts.fn(operation)
  } else {
    return opts.inverse(this)
  }
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
