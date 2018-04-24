{{#each operations}}
{{!-- TODO: This will break for resources with multiple operations with the same method. --}}
exports.{{toMethodName method}} = (event, context, callback) => {
  callback(null, { statusCode: 501, body: JSON.stringify({ code: 501, message: 'Not implemented' }) })
}
{{#ifNotLast ../operations @index}}

{{/ifNotLast}}
{{/each}}