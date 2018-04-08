const assert = require('assert')
const helper = require('../../lib/nameHelpers')

describe('#toSnakeCase', function() {
  it('should work', function() {
    assert.equal(helper.toSnakeCase('My Class Name'), 'my_class_name')
    assert.equal(helper.toSnakeCase('My Cla$$ Name'), 'my_cla_name')
    assert.equal(helper.toSnakeCase('_My_Class_Name'), 'my_class_name')
  })
})
