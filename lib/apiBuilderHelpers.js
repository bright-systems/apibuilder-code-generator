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
