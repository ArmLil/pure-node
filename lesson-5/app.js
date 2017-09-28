'use strict'
const Hapi = require('hapi')
const HapiSwagger = require('hapi-swagger')
const Inert = require('inert')
const Vision = require('vision')

const Handlers = require('./handlers')
const server = new Hapi.Server()

const Pack = require('./package')

const routes = require('./routes')

server.connection({
  host: 'localhost',
  port: 5000
})
server.register([
  Inert,
  Vision,
  {
    'register': HapiSwagger,
    'options': {
      info: {
        title: 'Tweets API',
        version: Pack.version,
      }
    }
  }], (error) => {
    server.views({
      engines: { pug: require('pug') },
      path: __dirname + '/public',
      compileOptions: { pretty: true }
    })

    server.start((error) => {
      if(error) console.error(error)
      console.log('server started on', server.info.uri)
    })
})

server.route(routes)

// server.on('request', (req, res) => {
//   console.log('on server....req=', req.url)
//   if (req.url === '/favicon.ico') {
//     return Handlers.favicon(res)
//   }
//   return Handlers.requestCheckEndpoint(req,res)
//   .then(response => {
//     const { code, message, type, redirect } = response.header
//
//     res.writeHead(code, {'Content-Type': type})
//
//     if (type === 'application/json') {
//       res.write(JSON.stringify(response.body, null, '\t'))
//     } else if (type === 'text/html' && code === 200) {
//       res.write(response.body)
//     } else if (type === 'text/plain') {
//       res.write(message)
//     } else if (code === 302) {
//       res.writeHead(302, {
//         'Location': redirect
//       })
//     }
//     res.end()
//   })
//   .catch(error => {
//     console.error('Opps', error)
//     res.statusCode = 400
//     res.statusMessage = error
//     res.end(error)
//   })
// })
//
// server.listen(5000, () => {
//   console.log('server listening on port', server.address().port)
// })
