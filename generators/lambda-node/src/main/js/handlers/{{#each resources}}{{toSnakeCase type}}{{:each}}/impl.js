{{#each operations}}
{{!-- TODO: This will break for resources with multiple operations with the same method. --}}
exports.{{toLowerCase method}} = async(event, context) => {
  return { statusCode: 501, body: JSON.stringify({ code: 501, message: 'Not implemented' }) }
}
{{#ifNotLast ../operations @index}}

{{/ifNotLast}}
{{/each}}
{{#eachSubModel ./type ./_root_.models}}
exports.{{toMethodName (toPlural name)}}By{{toClassName ../type}}Ids = async({{toMethodName ../type}}Ids) => {
  throw new Error('Not implemented')
}

{{/eachSubModel}}