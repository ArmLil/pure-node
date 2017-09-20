const pathModule = require('path')
const fs = require ('fs')

const Handlers = {}
module.exports = Handlers

const Templates = require('./templates')

const FAVICON = pathModule.join(__dirname, 'public', 'favicon.ico');



Handlers.favicon = (req, res) => {
  res.writeHead(200, {'Content-Type': 'image/x-icon'} );
  fs.createReadStream(FAVICON).pipe(res);
  res.end();
  return
}

Handlers.homePage = (req, res) => {
  return Templates.homePage(req,res)
}

Handlers.requestCheckEndpoint = (req, res) => {
  const { url, method } = req
  if (url === '/favicon.ico') {
    Handlers.favicon(req, res)
  } else if (url === '/' && method === 'GET') {
    return Handlers.homePage(req,res)
  }

  return Promise.reject('Not Found')
}

