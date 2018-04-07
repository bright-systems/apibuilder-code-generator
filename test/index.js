const index = require('../index')

describe('#handler', function() {
  it('should process a valid service.json', function() {
    const serviceJson = require('./resources/simple-models.json')
    const event = {
      body: JSON.stringify(serviceJson),
      pathParameters: {
        key: 'schema-evolution-manager'
      }
    }
    index.invocationsHandler(event, {}, function(err, data) {
      console.log(err)
      console.log(data)
    })
  })
})
