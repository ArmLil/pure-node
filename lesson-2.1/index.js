'use strict'

const fs = require ('fs')
const http = require('http')
const pathModule = require('path')
const pug = require('pug');

const TWEETS_PATH = './tweets.json'
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
      if (err) return reject(err);
      return resolve(data)
    });
  });
}

const writeFile = (path, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, (err) => {
      if (err) return reject(err)
    })
    return resolve(`PUT request, data written to ${TWEETS_PATH}`)
  })
}

const appendFile = (path, body) => {
  return new Promise((resolve, reject) => {
    fs.appendFile(path, body, (err) => {
      if (err) return reject(err)
    })
    return resolve(`POST request, data written to ${TWEETS_PATH}`)
  })
}

const create = (req, path) => {
  return readBody(req)
  .then((body) => appendFile(path, body))
  .then(response => {
    return Object.assign({}, {
      body: {
        message: response
      }
    }, {
      header: {
        code: 201,
        type: 'application/json',
        message: response,
      }
    })
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
    return Object.assign({}, {
      body: {
        message: response
      }
    }, {
      header: {
        code: 200,
        type: 'application/json',
        message: response,
      }
    })
  })
}

//...use with html
// const makeTweets = (tweets) => {
//   let tweetsLocal = JSON.parse(tweets).tweets
//   return tweetsLocal.map(tweet => {
//     return (`<li>
//       <h3>tweet:${tweet.tweet}</h3>
//       <h4>user:${tweet.user}</h4>
//     </li>`)
//   })
// }

const makeTweets = (tweets) => {
  let tweetsLocal = JSON.parse(tweets).tweets
  let local = tweetsLocal.map(tweet => {
      return (`
         li
          h3 ${tweet.tweet}
          h4 user: ${tweet.user}
          p id: ${tweet.id}\n`)
    })
    local = local.toString().replace(/,/g, "")
    return `
h1 Our Tweets
ul
${local}
`
}

const homePage = (req, path) => {
  return readFile(path)
  .then(makeTweets)
  .then(tweets => {
  //...use with html
  // tweets = `<html><body>${tweets}</body></html>`
  // tweets = tweets.replace(/,/g, "")

  const pugTweets = pug.compile(tweets)
    return Object.assign({}, {
    //body: tweets //...use with html
    body: pugTweets()
  }, {
    header: {
      code: 200,
      type: 'text/html',
      message: 'GET request',
    }
  })
})
}

const requestHandle = (req) => {
  const { method, url, body } = req;
  const fileExists = fs.existsSync(TWEETS_PATH)

  if(url === '/tweets') {
    if (method === 'POST' && !fileExists)
      return create(req, TWEETS_PATH)
    else if (method === 'PUT' && fileExists)
      return update(req, TWEETS_PATH)
    else if (method === 'GET' && fileExists) {
      return readFile(TWEETS_PATH)
      .then(tweets => JSON.parse(tweets))
      .then(response => {
        return Object.assign({}, {
          body: response
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
  else if (url === '/' && method === 'GET') {
    return homePage(req, TWEETS_PATH)
  }
  else return Promise.reject('Bad Request')
}

const server = http.createServer()

server.on('request', (req, res) => {
  if (req.url === '/favicon.ico') {
    res.writeHead(200, {'Content-Type': 'image/x-icon'} );
    fs.createReadStream(FAVICON).pipe(res);
    res.end();
    return;
  }
  return requestHandle(req)
    .then((response) => {
      const { code, message, type } = response.header
      res.writeHead(code, message, {
        'Content-Type': type
      })
      if( type === 'text/html'){
        res.write(response.body)
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
});

server.listen(3001, () => {
  console.log('server listening on port', server.address().port)
})
