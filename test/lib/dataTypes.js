const assert = require('assert')
const helper = require('../../lib/dataTypes')

describe('#translateGraphQL', function() {
  it('should work for basic datatypes', function() {
    assert.equal(helper.translateGraphQL('boolean'), 'Boolean')
    assert.equal(helper.translateGraphQL('decimal'), 'Float')
    assert.equal(helper.translateGraphQL('double'), 'Float')
    assert.equal(helper.translateGraphQL('integer'), 'Int')
    assert.equal(helper.translateGraphQL('long'), 'Int')
    assert.equal(helper.translateGraphQL('string'), 'String')
  })

  it('should work for custom types', function() {
    assert.equal(helper.translateGraphQL('date-iso8601'), 'AWSDate')
    assert.equal(helper.translateGraphQL('date-time-iso8601'), 'AWSDateTime')
  })

  it('should work for arrays of basic datatypes', function() {
    assert.equal(helper.translateGraphQL('[boolean]'), '[Boolean]')
    assert.equal(helper.translateGraphQL('[decimal]'), '[Float]')
    assert.equal(helper.translateGraphQL('[double]'), '[Float]')
    assert.equal(helper.translateGraphQL('[integer]'), '[Int]')
    assert.equal(helper.translateGraphQL('[long]'), '[Int]')
    assert.equal(helper.translateGraphQL('[string]'), '[String]')
  })

  it('should work for enums', function() {
    assert.equal(helper.translateGraphQL('Gender', [
      {
        'name': 'Gender',
        'plural': 'Genders',
        'values': [
          { 'name': 'female' },
          { 'name': 'male' }
        ]
      }
    ]), 'Gender')
  })

  it('should work for arrays of enums', function() {
    assert.equal(helper.translateGraphQL('[Gender]', [
      {
        'name': 'Gender',
        'plural': 'Genders',
        'values': [
          { 'name': 'female' },
          { 'name': 'male' }
        ]
      }
    ]), '[Gender]')
  })

  it('should work for models', function() {
    assert.equal(helper.translateGraphQL('MyObject', [], [
      {
        'name': 'MyObject',
        'plural': 'MyObjects',
        'fields': [
          {
            'name': 'id',
            'type': 'integer',
            'required': true,
            'description': 'Unique identifier.'
          }
        ]
      }
    ]), 'MyObject')
  })

  it('should work for arrays of models', function() {
    assert.equal(helper.translateGraphQL('[MyObject]', [], [
      {
        'name': 'MyObject',
        'plural': 'MyObjects',
        'fields': [
          {
            'name': 'id',
            'type': 'integer',
            'required': true,
            'description': 'Unique identifier.'
          }
        ]
      }
    ]), '[MyObject]')
  })

  it('should work for input models', function() {
    assert.equal(helper.translateGraphQL('MyObject', [], [
      {
        'name': 'MyObject',
        'plural': 'MyObjects',
        'fields': [
          {
            'name': 'id',
            'type': 'integer',
            'required': true,
            'description': 'Unique identifier.'
          }
        ]
      }
    ], true), 'MyObjectInput')
  })

  it('should work for arrays of input models', function() {
    assert.equal(helper.translateGraphQL('[MyObject]', [], [
      {
        'name': 'MyObject',
        'plural': 'MyObjects',
        'fields': [
          {
            'name': 'id',
            'type': 'integer',
            'required': true,
            'description': 'Unique identifier.'
          }
        ]
      }
    ], true), '[MyObjectInput]')
  })
})
