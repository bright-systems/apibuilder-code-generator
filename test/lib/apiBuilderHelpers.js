const assert = require('assert')
const helper = require('../../lib/apiBuilderHelpers')

describe('#pathToSwagger', function() {
  it('should work', function() {
    assert.equal(helper.pathToSwagger('/foos/:id'), '/foos/{id}')
    assert.equal(helper.pathToSwagger('/foos/:id/bars'), '/foos/{id}/bars')
    assert.equal(helper.pathToSwagger('/foos/:id/bars/:bar-id'), '/foos/{id}/bars/{bar-id}')
  })
})
