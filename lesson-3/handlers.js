const pathModule = require('path')
const fs = require ('fs')

const Handlers = {}
module.exports = Handlers

const Templates = require('./templates')
const Database = require('./database')
const Utils = require('./utils')

const FAVICON = pathModule.join(__dirname, 'public', 'favicon.ico');
const TWEETS_PATH = './tweets.json'

const fileExists = fs.existsSync(TWEETS_PATH)

Handlers.favicon = (req, res) => {
  res.writeHead(200, {'Content-Type': 'image/x-icon'} );
  fs.createReadStream(FAVICON).pipe(res);
  res.end();
  return
}

Handlers.homePage = (req, res) => {
  return Templates.homePage(req,res)
}

Handlers.tweetsGetHandle = (req) => {
  const id = Utils.getQueryId(req.url)
  if(id) {
    return Database.tweets()
    .then((data) => {
      let tweetsArray = JSON.parse(data).tweets
      return Utils.findTweetById(id, tweetsArray)
    })
    .then(tweet => Utils.successGetResponse(tweet))
  } else {
    return Database.tweets()
    .then(tweets => Promise.resolve(JSON.parse(tweets)))
    .then(tweets => Utils.successGetResponse(tweets))
  }
}

Handlers.tweetsPostHandle = (req) => {
  return Utils.getBodyObj(req)
  .then((body) => {
    if(!fileExists)
      return Database.createFile(body)
    else
      return Database.addTweets(body)
  })
  .then((message) => Utils.successTextResponse(message))
}

Handlers.tweetsPutHandle = (req) => {
  return Database.updateFile(req)
 .then((message) => Utils.successTextResponse(message))
}

Handlers.tweetsDeleteHandle = (req) => {
  return Database.updateFile(req)
 .then((message) => Utils.successTextResponse(message))
}


Handlers.tweetsEndpointHandle = (req, res) => {
  const { method } = req
  if (method === 'POST')
    return Handlers.tweetsPostHandle(req)
  else if (method === 'PUT')
    return Handlers.tweetsPutHandle(req)
  else if (method === 'GET')
    return Handlers.tweetsGetHandle(req)
  else if (method === 'DELETE')
      return Handlers.tweetsDeleteHandle(req)
  else return Promise.reject('Bad Request')
}

Handlers.requestCheckEndpoint = (req, res) => {
  const { url, method } = req
  const query = url.split('?')[1]
  const param = req.url.split('?')[0]
  console.log('param', param)
  if (!fileExists && url !== '/' && method !== 'POST') {
    return Utils.dbNotExistResponse()
  } else if (url === '/' && method === 'GET') {
    return Handlers.homePage(req,res)
  } else if (url === '/tweets'
  || (url.split('/')[1] === 'tweets')) {
    return Handlers.tweetsEndpointHandle(req, res)
  }
   else return Promise.reject('Not Found')
}
