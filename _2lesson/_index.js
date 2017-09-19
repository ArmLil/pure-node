'use strict'
const fs = require ('fs')
const http = require('http')
const pathModule = require('path')
const pug = require('pug')

const TWEETS_PATH = './tweets.json'
const TWEETS_TEMPLATE = './tweets.pug'


const FAVICON = pathModule.join(__dirname, 'public', 'favicon.ico');

const readBody = (req) => {
  let body = []
  return new Promise((resolve, reject) => {
    req.on('data', (chunk) => {
      body.push(chunk)
      body = Buffer.concat(body).toString()
    });
    req.on('end', () => { return resolve(body) });
    req.on('error', (e) => { return reject(e.message) });
  })
}

const readFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) return reject('readFile error',err);
      resolve(data)
    });
  });
}

const writeFile = (path, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, (err) => {
      if (err) return reject('writeFile error', err)
    })
    return resolve(`PUT request, data written to ${TWEETS_PATH}`)
  })
}

const appendFile = (path, body) => {
  return new Promise((resolve, reject) => {
    fs.appendFile(path, body, (err) => {
      if (err) return reject('appendFile error',err)
    })
    return resolve(`POST request, data written to ${TWEETS_PATH}`)
  })
}

const create = (req, path) => {
  return readBody(req)
  .then((body) => appendFile(path, body))
  .then(response => {
    return Promise.resolve(Object.assign({}, {
      body: {
        message: response
      }
    }, {
      header: {
        code: 201,
        type: 'application/json',
        message: response,
      }
    }))
  })
}

const update = (req, path) => {
  let localBody
  return readBody(req)
  .then((body) => localBody = body)
  .then(() => readFile(path))
  .then((data) => {
    let tweetsArray = []
    if(data) tweetsArray = JSON.parse(data).tweets
    const bodyArray = JSON.parse(localBody).tweets
    const newTweetsArray = tweetsArray.concat(bodyArray)
    const newTweetsObject = {tweets: newTweetsArray.filter(n => n)}
    const result = JSON.stringify(newTweetsObject, null, '\t')
    return result
  })
  .then((result) => writeFile(path, result))
  .then(response => {
    return Promise.resolve(Object.assign({}, {
      body: {
        message: response
      }
    }, {
      header: {
        code: 200,
        type: 'application/json',
        message: response,
      }
    }))
  })
}

const createTweet = (tweet, path) => {
  return readFile(path)
    .then((data) => {
      let tweetsArray = []
      if(data) tweetsArray = JSON.parse(data).tweets
      tweet.id = tweetsArray.length
      const newTweetsArray = tweetsArray.concat(tweet)
      const newTweetsObject = {tweets: newTweetsArray.filter(n => n)}
      const result = JSON.stringify(newTweetsObject, null, '\t')
      return writeFile(path, result)
    })
}

const homePage = (req, path) => {
  console.log('row 114 createHomePage')
  return readFile(path)
  .then(tweets => {console.log('homePage row 116 tweets', tweets)
    return  JSON.parse(tweets)})
  .then(tweets => {
    console.log('row 119 after JSON.parse')
    return Promise.resolve(Object.assign({}, {
        body: pug.renderFile(TWEETS_TEMPLATE, tweets)
      }, {
        header: {
          code: 200,
          type: 'text/html',
          message: 'GET request',
        }
      }))
  })
}

const tweetEndpointHandle = (req) => {
  const fileExists = fs.existsSync(TWEETS_PATH)
  const { method } = req
  if (method === 'POST' && !fileExists)
    return create(req, TWEETS_PATH)
  else if (method === 'PUT' && fileExists)
    return update(req, TWEETS_PATH)
  else if (method === 'GET' && fileExists) {
    return readFile(TWEETS_PATH)
    .then(tweets => JSON.parse(tweets))
    .then(tweets => {
      return Object.assign({}, {
        body: tweets
      }, {
        header: {
          code: 200,
          type: 'application/json',
          message: 'GET request',
        }
      })
    })
  }
  else return Promise.reject('Bad Request')
}

const getQueryObj = (url)=> {
  let params = url.split('?')[1]
  params = params.split('&')
  let obj = {}
  let queryObj = {}
  params.map(param => {
    const clean = param.split('=')
    obj = {[clean[0]] : clean[1]}
    queryObj = Object.assign(queryObj, obj)
  })
  return queryObj
}

const createEndpointHandle = (req) => {
  return Promise.resolve(getQueryObj(req.url))
  .then((tweetObj) => createTweet(tweetObj, TWEETS_PATH))
  .then(() => {
    return Promise.resolve(Object.assign({}, {
      header: {
        code: 302,
        type: 'text/html',
        message: 'Redirect',
        redirect: '/'
      }
    }))
  })
}

const requestHandle = (req) => {
  const { method, url, body } = req;
  const fileExists = fs.existsSync(TWEETS_PATH)
  console.log('row 188, request handle url', url)
  if((url === '/create' || url.split('?')[0] === '/create') && method === 'GET') {
     console.log('create endpoint')
     return createEndpointHandle(req)
  } else if(url === '/tweets') {
     return Promise.resolve(tweetEndpointHandle(req))
  } else if (url === '/' && method === 'GET') {
    return homePage(req, TWEETS_PATH)
  } else return Promise.reject('Bad Request')
}

const server = http.createServer()

server.on('request', (req, res) => {
  console.log('on request')
  if (req.url === '/favicon.ico') {
    res.writeHead(200, {'Content-Type': 'image/x-icon'} );
    fs.createReadStream(FAVICON).pipe(res);
    res.end();
    return;
  }
  return requestHandle(req)
    .then((response) => {
      const { code, message, type, redirect } = response.header
      res.writeHead(code, message, {
        'Content-Type': type
      })
      console.log('215 code === 200 header=',response.header)
      if( type === 'text/html' && code === 200) {
        console.log('217 code === 200 header=',response.header)
        res.write(response.body)
      } else if (code === 302) {
        console.log('220 (code === 302 header=',response.header)
        res.writeHead(302, {
          'Location': redirect
        })
      } else {
        console.log('225 else heder=',response.header)
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
});

server.listen(3000, () => {
  console.log('server listening on port', server.address().port)
})