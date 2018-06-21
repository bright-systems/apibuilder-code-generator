const assert = require('assert')
const impl = require('../../../../main/js/handlers/{{toSnakeCase type}}/impl')

describe('{{toSnakeCase type}}.impl', () => {
{{#each operations}}
  describe('{{toLowerCase method}}', () => {
    it('should work', () => {
      return impl.{{toLowerCase method}}(
        { },
        { }
      )
        .then(data => {
          assert(data.statusCode >= 200 && data.statusCode <= 299)
        })
    })
  })
{{#ifNotLast ../operations @index}}

{{/ifNotLast}}
{{/each}}
})
