const impl = require('./impl')

exports.handler = (event, context, callback) => {
  switch (event.httpMethod.toLowerCase()) {
{{#each operations}}
    case '{{toLowerCase method}}':
      return impl.{{toMethodName method}}(event, context, callback)
      break
{{/each}}
    default:
      callback(null, { statusCode: 405, body: JSON.stringify({ code: 405, message: 'HTTP method [' + event.httpMethod + '] does not exist for endpoint [' + event.path + '].' }) })
      break
  }
}
