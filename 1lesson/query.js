'use strict'
const http = require('http');
const qs = require('querystring');

const server = http.createServer();

server.on('request', (req, res) => {
  const str = req.url.split('?')[1]
  const param = req.url.split('?')[0]
  const url_json = qs.parse(str)
  // console.log('url_json=', url_json)
  // console.log('req.url=', req.url)
  // console.log('param=',param)
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

// handle localhost:3000/hello with responding with 'Hello Friend'
// handle localhost:3000/bye with responding with 'Bye Friend'
// handle localhost:3000/search?t=hello with responding with 'Will search for hello' (this means you are handeling a query, the query will be inside the req)
// handle localhost:3000/search?t=hello&filter=1,2,3 responding with 'Will search for hello and filters set to 1, 2, 3'
// format the above tasks in html <html> <h1>Stuff</h1></html>
