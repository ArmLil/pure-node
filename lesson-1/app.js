'use strict'
const http = require('http');
const qs = require('querystring');

const server = http.createServer();

server.on('request', (req, res) => {
  const str = req.url.split('?')[1]
  const param = req.url.split('?')[0]
  const url_json = qs.parse(str)
  switch(param){
    case '/':
      res.write('<html><h1>We are in the root...</h1></html>')
      break
    case '/hello':
      res.write('<html><h1>Hello Friend!!</h1></html>')
      break
    case '/bye':
      res.write('<html><h1>Bye Friend!!</h1></html>')
      break
    case '/search':
      if (url_json.t && url_json.filter) {
        res.write(`<html><h1> Will search for ${url_json.t} and filters set to ${url_json.filter} </h1></html>`)
      } else if (url_json.t) {
        res.write(`<html><h1> Will search for ${url_json.t} </h1></html>`)
      } else {
        res.write(`<html><h1> Bad Request!! </h1></html>`)
      }
      break
    default: res.write(`<html><h1> Bad Request!! </h1></html>`)
  }
  res.end();
});

server.listen(3005, () => {
  console.log('server listening on port 3005')
})
