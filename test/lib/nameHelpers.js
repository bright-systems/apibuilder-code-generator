const assert = require('assert')
const helper = require('../../lib/nameHelpers')

describe('#toClassName', function() {
  it('should work', function() {
    assert.equal(helper.toClassName('My Class Name'), 'MyClassName')
    assert.equal(helper.toClassName('My_Cla$$ Name'), 'MyClaName')
    assert.equal(helper.toClassName('_My_Class_Name'), 'MyClassName')
  })
})

describe('#toPlural', function() {
  it('should work', function() {
    assert.equal(helper.toPlural('house'), 'houses')
    assert.equal(helper.toPlural('houses'), 'houses')
    assert.equal(helper.toPlural('mouse'), 'mice')
    assert.equal(helper.toPlural('laundry'), 'laundries')
    assert.equal(helper.toPlural('skus'), 'skus')
  })
})

describe('#toSnakeCase', function() {
  it('should work', function() {
    assert.equal(helper.toSnakeCase('My Class Name'), 'my_class_name')
    assert.equal(helper.toSnakeCase('My Cla$$ Name'), 'my_cla_name')
    assert.equal(helper.toSnakeCase('_My_Class_Name'), 'my_class_name')
  })
})

describe('#toMethodName', function() {
  it('should work', function() {
    assert.equal(helper.toMethodName('My Function Name'), 'myFunctionName')
    assert.equal(helper.toMethodName('My_Functi^^ Name'), 'myFunctiName')
    assert.equal(helper.toMethodName('_My_Function_Name'), 'myFunctionName')
  })
})
