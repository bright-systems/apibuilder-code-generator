const assert = require('assert')
const index = require('../../../../main/js/handlers/{{toSnakeCase type}}/index')

describe('{{toSnakeCase type}}.handler', () => {
{{#each operations}}
  it('should work for {{method}}', () => {
    return index.handler(
      {
        httpMethod: '{{method}}'
        {{!-- TODO: Pass in appropriate test data --}}
      },
      {}
    )
      .then(data => {
        {{!-- TODO: Assert for correct 2XX statusCode --}}
        assert(data.statusCode >= 200 && data.statusCode <= 299)
      })
  })
{{#ifNotLast ../operations @index}}

{{/ifNotLast}}
{{/each}}
})
