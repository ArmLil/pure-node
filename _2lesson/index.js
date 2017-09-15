'use strict'

const fs = require ('fs')
const http = require('http')
const pathModule = require('path')

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

const read_file = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) return reject(err);
      resolve(data)
    });
  });
}

const write_file = (path, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, (err) => {
      if (err) return reject(err)
    })
    return resolve(`PUT request, data written to ${TWEETS_PATH}`)
  })
}

const append_file = (path, body) => {
  return new Promise((resolve, reject) => {
    fs.appendFile(path, body, (err) => {
      if (err) return reject(err)
    })
    return resolve(`POST request, data written to ${TWEETS_PATH}`)
  })
}

const create = (req, path) => {
  return readBody(req)
  .then((body) => append_file(path, body))
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
  .then(() => read_file(path))
  .then((data) => {
    let tweetsArray = []
    if(data) tweetsArray = JSON.parse(data).tweets
    const bodyArray = JSON.parse(localBody).tweets
    const newTweetsArray = tweetsArray.concat(bodyArray)
    const newTweetsObject = {tweets: newTweetsArray.filter(n => n)}
    const result = JSON.stringify(newTweetsObject, null, '\t')
    return result
  })
  .then((result) => write_file(path, result))
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

const requestHandle = (req) => {
  const { method, url, body } = req;
  const fileExists = fs.existsSync(TWEETS_PATH)

  if(url === '/tweets') {
    if (method === 'POST' && !fileExists)
      return create(req, TWEETS_PATH)
    else if (method === 'PUT' && fileExists)
      return update(req, TWEETS_PATH)
    else if (method === 'GET' && fileExists) {
      return read_file(TWEETS_PATH)
      .then(response => {
        return Object.assign({}, {
          body: {
            message: response
          }
        }, {
          header: {
            code: 200,
            type: 'text/plain',
            message: 'GET request',
          }
        })
      })
    }
    else return Promise.reject('Bad Request')
  }
  else if (url === '/' && method === 'GET') {
    return Promise
    .resolve(Object.assign({}, {
      body: {
        message: 'GET request'
      }
    }, {
      header: {
        code: 200,
        type: 'text/plain',
        message: 'GET request',
      }
    }))
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
      res.end(JSON.stringify(response.body))
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
