exports.capitalize = str => {
  return str.toLowerCase().split(' ').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
}

exports.repeat = (str, n) => {
  return str.repeat(n)
}

exports.toLowerCase = str => {
  return str.toLowerCase()
}

exports.toUpperCase = str => {
  return str.toUpperCase()
}
