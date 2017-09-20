const TWEETS_PATH = './tweets.json'
const TWEETS_TEMPLATE = './public/tweets.pug'


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

const createFile = (req, path) => {
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

const updateFile = (req, path) => {
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
      const id = `${new Date().valueOf()}`;
      tweet.id = id;
      tweet.color = `rgb(${parseInt(Math.random()*300)}, 0, ${parseInt(Math.random()*200)})`
      const newTweetsArray = tweetsArray.concat(tweet)
      const newTweetsObject = {tweets: newTweetsArray.filter(n => n)}
      const result = JSON.stringify(newTweetsObject, null, '\t')
      return writeFile(path, result)
    })
}

const updateTweet = (newTweet, path) => {
  return readFile(path)
    .then((data) => {
      let tweetsArray = JSON.parse(data).tweets
      let newTweetsArray = tweetsArray.map(oldTweet => {
        if(newTweet.id === oldTweet.id) {
          return oldTweet = Object.assign({}, oldTweet, newTweet)
        }
        return oldTweet
      })
      const newTweetsObject = {tweets: newTweetsArray.filter(n => n)}
      const result = JSON.stringify(newTweetsObject, null, '\t')
      return writeFile(path, result)
    })
}

const deleteTweet = (id, path) => {
  return readFile(path)
    .then((data) => {
      let tweetsArray = []
      if(data) tweetsArray = JSON.parse(data).tweets
      tweetsArray = tweetsArray.map(tweet => {
        if(tweet.id === id) {
          return null
        }
        return tweet
      })
      const newTweetsObject = {tweets: tweetsArray.filter(n => n)}
      const result = JSON.stringify(newTweetsObject, null, '\t')
      return writeFile(path, result)
    })
}

const getQueryId = (url) => {
  let id = url.split('/')
  id = id[id.length-1]
  id = id.split('?')
  id = id[0]
  return id
}

const tweetEndpointHandle = (req) => {
  const fileExists = fs.existsSync(TWEETS_PATH)
  const { method } = req
  if (method === 'POST' && !fileExists)
    return createFile(req, TWEETS_PATH)
  else if (method === 'PUT' && fileExists)
    return updateFile(req, TWEETS_PATH)
  else if (method === 'GET' && fileExists) {
    return readFile(TWEETS_PATH)
    .then(tweets => JSON.parse(tweets))
    .then(tweets => {
      return Promise.resolve(Object.assign({}, {
        body: tweets
      }, {
        header: {
          code: 200,
          type: 'application/json',
          message: 'GET request',
        }
      }))
    })
  }
  else return Promise.reject('Bad Request')
}

const createEndpointHandle = (req) => {
  let tweetObj = getQueryObj(req.url)
  return createTweet(tweetObj, TWEETS_PATH)
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

const deleteEndpointHandle = (req) => {
  let id = getQueryId(req.url)
  return deleteTweet(id, TWEETS_PATH)
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

const updateEndpointHandle = (req) => {
  const id = getQueryId(req.url)
  let tweetObj = getQueryObj(req.url)
  tweetObj = Object.assign({}, tweetObj, {id})
  return updateTweet(tweetObj, TWEETS_PATH)
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