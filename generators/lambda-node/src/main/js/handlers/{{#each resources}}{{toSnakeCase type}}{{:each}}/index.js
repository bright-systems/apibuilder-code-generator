const impl = require('./impl')

exports.handler = (event, context) => {
  console.log('event: ' + JSON.stringify(event))
  const httpMethod = Array.isArray(event) ? event[0].httpMethod : event.httpMethod
  switch ((httpMethod || '').toLowerCase()) {
    case 'ping':
      return { statusCode: 204 }
{{#each operations}}
    case '{{toLowerCase method}}':
      return impl.{{toLowerCase method}}(event, context)
{{/each}}
    default:
      const resource = Array.isArray(event) ? event[0].resource : event.resource
      switch (resource) {
        {{#eachSubModel ./type ./_root_}}
        case 'get{{toClassName (toPlural name)}}By{{toClassName ../type}}Id':
          return get{{toClassName (toPlural name)}}ByUserId(event, context)
        {{/eachSubModel}}
        default:
          if (Array.isArray(event)) {
            return event.map(() => ({ statusCode: 405, body: JSON.stringify({ code: 405, message: 'HTTP method [' + event.httpMethod + '] does not exist for endpoint [' + event.path + '].' }) }))
          } else {
            return { statusCode: 405, body: JSON.stringify({ code: 405, message: 'HTTP method [' + event.httpMethod + '] does not exist for endpoint [' + event.path + '].' }) }
          }
      }
  }
}
{{#eachSubModel ./type ./_root_}}

const get{{toClassName (toPlural name)}}By{{toClassName ../type}}Id = async(event, context) => {
  const arrayEvent = Array.isArray(event)
  if (!arrayEvent) event = [event]
  return impl.{{toMethodName (toPlural name)}}By{{toClassName ../type}}Id(event.map(e => e.pathParameters.{{toMethodName ../type}}Id))
    .then({{toMethodName (toPlural name)}}Map => {
      if (arrayEvent) {
        return event.map(e => ({ statusCode: 201, body: JSON.stringify({{toMethodName (toPlural name)}}Map[e.pathParameters.{{toMethodName ../type}}Id] || []) }))
      } else {
        return { statusCode: 200, body: JSON.stringify({{toMethodName (toPlural name)}}Map[event[0].pathParameters.{{toMethodName ../type}}Id] || []) }
      }
  })
}{{/eachSubModel}}
