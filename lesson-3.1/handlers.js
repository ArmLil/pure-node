const pathModule = require('path')
const fs = require ('fs')
const Templates = require('./templates')
const Database = require('./database')
const Utils = require('./utils')

const FAVICON = pathModule.join(__dirname, 'public', 'favicon.ico');
const TWEETS_PATH = './tweets.json'

const fileExists = fs.existsSync(TWEETS_PATH)

const Handlers = {}
module.exports = Handlers

Handlers.favicon = (req, res) => {
  res.writeHead(200, {'Content-Type': 'image/x-icon'} );
  fs.createReadStream(FAVICON).pipe(res);
  res.end();
  return
}

const homePage = (req, res) => {
  return Database.tweets()
  .then((data) => Templates.homePage(req,data))
}

const tweetsGet = (req, id) => {
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

const tweetsPost = (req) => {
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


Handlers.apiEndpointHandle = (req, res) => {
  const {url, method } = req

  // remove from the url the begening of the url for cleaner us
  const endpoint = url.replace('/api/','')
  const endpointParts = endpoint.split('/')

  if(endpointParts[0] === 'tweets'){
    if(endpointParts.length === 1){
      if (method === 'POST') return tweetsPost(req)
      else if (method === 'GET') return tweetsGet(req)
    }
    else {
      if (endpointParts.length === 2 && parseInt(endpointParts[1])){
        if (method === 'GET') return tweetsGet(req, endpointParts[1])
      }
    }
  }

  return Promise.reject('Bad Request')

  // if (method === 'POST')
  // else if (method === 'PUT')
  //   return Handlers.tweetsPutHandle(req)
  // else if (method === 'GET')
  //   return Handlers.tweetsGetHandle(req)
  // else if (method === 'DELETE')
  //     return Handlers.tweetsDeleteHandle(req)

}

Handlers.endpointHandle = (req, res) => {
  const {url, method } = req
  if (method === 'GET'){
    if(url === '/') return homePage(req,res)
  } else return Promise.reject('Bad Request')
}

Handlers.requestCheckEndpoint = (req, res) => {
  const { url, method } = req
  if(url.split('/')[1] === 'api'){
    console.log('DO API related operations here')

    return Handlers.apiEndpointHandle(req, res)
  } else {
    return Handlers.endpointHandle(req,res)
  }

}
