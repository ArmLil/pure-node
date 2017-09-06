// server.on('request', (req, res) => {
//   const str = req.url.split('?')[1]
//   const param = req.url.split('?')[0]
//   const url_json = qs.parse(str)
//   console.log('url_json=', url_json)
//   console.log('req.url=', req.url)
//   console.log('param=',param)
//   if(req.url === '/'){
//     res.write('<html><h1>We are in the root...</h1></html>')
//   } else if (req.url === '/hello'){
//     res.write('<html><h1>Hello Friend!!</h1></html>')
//   } else if (req.url === '/bye'){
//     res.write('<html><h1>Bye Friend!!</h1></html>')
//   } else if (param === '/search' && url_json.t && url_json.filter) {
//     res.write(`<html><h1> Will search for ${url_json.t} and filters set to ${url_json.filter} </h1></html>`)
//   } else if (param === '/search' && url_json.t) {
//     res.write(`<html><h1> Will search for ${url_json.t} </h1></html>`)
//   } else {
//     res.write(`<html><h1> Bad Request!! </h1></html>`)
//   }
//   res.end();
// });
