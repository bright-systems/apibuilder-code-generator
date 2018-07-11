const impl = require('./impl')

exports.handler = (event, context) => {
  console.log('event: ' + JSON.stringify(event))
  switch (event.httpMethod.toLowerCase()) {
    case 'ping':
      return { statusCode: 204 }
{{#each operations}}
    case '{{toLowerCase method}}':
      return impl.{{toLowerCase method}}(event, context)
{{/each}}
    default:
      return { statusCode: 405, body: JSON.stringify({ code: 405, message: 'HTTP method [' + event.httpMethod + '] does not exist for endpoint [' + event.path + '].' }) }
  }
}
