exports.eachSelected = (arr, propertyName, value, delimiter, opts) => {
  return arr.filter(v => v[propertyName] === value)
    .map(v => opts.fn(v))
    .join(delimiter)
}

exports.ifAttributeExists = (arr, name, opts) => {
  const item = arr.find(i => i.name === name)
  if (item) { return opts.fn(item) } else { return opts.inverse(this) }
}

exports.ifNotLast = (arr, index, opts) => {
  if (arr.length - 1 > index) { return opts.fn(this) } else { return opts.inverse(this) }
}
