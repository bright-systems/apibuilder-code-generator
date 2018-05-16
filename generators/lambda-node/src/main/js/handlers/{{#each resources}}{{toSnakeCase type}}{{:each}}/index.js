const impl = require('./impl')

exports.handler = (event, context) => {
  switch (event.httpMethod.toLowerCase()) {
{{#each operations}}
    case '{{toLowerCase method}}':
      return impl.{{toMethodName method}}(event, context)
{{/each}}
    default:
      return { statusCode: 405, body: JSON.stringify({ code: 405, message: 'HTTP method [' + event.httpMethod + '] does not exist for endpoint [' + event.path + '].' }) }
  }
}
