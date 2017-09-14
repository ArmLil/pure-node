'use strict'

const fs = require ('fs')
const http = require('http')

const TWEETS_PATH = './tweets.json'

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
  .then((body) => {
    return append_file(path, body)
  })
}

const update = (req, path) => {
  return readBody(req)
  .then((body) => {
    return read_file(path)
    .then((data) => {
      let tweetsArray = []
      if(data) tweetsArray = JSON.parse(data).tweets
      const bodyArray = JSON.parse(body).tweets
      const newTweetsArray = tweetsArray.concat(bodyArray)
      const newTweetsObject = {tweets: newTweetsArray.filter(n => n)}
      const result = JSON.stringify(newTweetsObject, null, '\t')
      return write_file(path, result)
      })
  })
}

const requestHandle = (req) => {
  const { method, url, body } = req;
	const fileExists = fs.existsSync(TWEETS_PATH)

  if(url === '/tweets') {
		if (method === 'POST' && !fileExists)
      return create(req, TWEETS_PATH)
    else if (method == 'PUT' && fileExists)
			return update(req, TWEETS_PATH)
    else if (method == 'GET') {
      return read_file(TWEETS_PATH)
    }
    else return Promise.reject('Bad Request')
  }
  else if (url == '/' && method == 'GET') {
    return Promise.resolve("Hello there!!!")
  }
  else return Promise.reject('Bad Request')
}

const server = http.createServer()

server.on('request', (req, res) => {
  return requestHandle(req)
    .then((response) => {
      console.log(response)
      res.end(response)
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
