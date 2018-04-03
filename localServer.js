// To be used for development/testing. This is should mirror what is happening in
// API Gateway / AWS Lambda in the prod instance.

const http = require('http')
const port = process.argv[2] || 9003
const index = require('./index')
const url = require('url')

const requestHandler = (request, response) => {
  console.log(request.url)
  const pathParts = url.parse(request.url).pathname.toLowerCase().replace(/^\//, '').split('/')
  if (pathParts[0] === 'generators' && request.method === 'GET') {
    index.generatorsHandler(
      {
        body: request.body,
        pathParameters: pathParts[1] ? {
          key: pathParts[1]
        } : null
      },
      {},
      function(err, data) {
        processCallback(response, err, data)
      }
    )
  } else if (pathParts[0] === 'invocations' && request.method === 'POST') {
    var body = ''
    request.on('readable', function() {
      const current = request.read()
      if (current != null) body += current
    })
    request.on('end', function() {
      index.invocationsHandler(
        {
          body: body,
          pathParameters: {
            key: pathParts[1]
          }
        },
        {},
        function(err, data) {
          processCallback(response, err, data)
        }
      )
    })
  } else {
    processCallback(response, null, { statusCode: 404 })
  }
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})

function processCallback(response, err, data) {
  if (err) {
    response.statusCode = 500
    response.end(err.toString())
  } else {
    response.statusCode = data.statusCode
    response.end(data.body)
  }
}
