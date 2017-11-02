var Hapi = require('hapi')

// create new server instance
var server = new Hapi.Server()

// add server’s connection information
server.connection({
  host: 'localhost',
  port: 3500
})

server.state('session', {
  ttl: 1000 * 60 * 60 * 24,
  isSecure: false,
  isHttpOnly: true,    // 1 day lifetime
  encoding: 'base64json'       // cookie data is JSON-stringified and Base64 encoded
})


server.route({
  method: 'GET',
  path: '/',
  config: {
    handler: function (request, reply) {
      var cookie = request.state.session

      if (cookie) {
        // use cookie values
        console.log({cookie})
        cookie = {
          username: 'newUser1',
          firstVisit: false
        }
      }

      if (!cookie) {
        cookie = {
          username: 'futurestudio',
          firstVisit: false
        }
      }


      cookie.lastVisit = Date.now()

      reply('Hello there!')
      .state('session', cookie)
    }
  }
})

server.start((error) => {
  if(error) console.error(error)
  console.log('server started on', server.info.uri)
})
