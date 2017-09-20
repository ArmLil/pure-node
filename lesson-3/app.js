'use strict'
const http = require('http')

const Utils = require('./utils')
const Handlers = require('./handlers')

const server = http.createServer()
server.on('request', (req, res) => {  
  return Handlers.requestCheckEndpoint(req,res)
  .then(response => {
    const { code, message, type, redirect } = response.header

    res.writeHead(code, message, {
      'Content-Type': type
    })
    if( type === 'text/html' && code === 200) {
      res.write(response.body)
    } else if (code === 302) {
      res.writeHead(302, {
        'Location': redirect
      })
    } else {
      res.write(JSON.stringify(response.body))
    }
    res.end()

  })
  .catch(error => {
    console.error('Opps', error)
    res.statusCode = 400
    res.statusMessage = error
    res.end(error)
  })  
})

server.listen(5000, () => {
  console.log('server listening on port', server.address().port)
})