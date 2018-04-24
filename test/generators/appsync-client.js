const index = require('../../index')

describe('#handler', function() {
  it('should process a valid service.json', function() {
    const serviceJson = require('../resources/apibuilder-api.service.json')
    const event = {
      body: JSON.stringify(serviceJson),
      pathParameters: {
        key: 'appsync-client'
      }
    }
    index.invocationsHandler(event, {}, function(err, data) {
      console.log(err)
      console.log(data)
    })
  })
})
