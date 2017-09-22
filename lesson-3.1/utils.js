const Utils = {}
module.exports = Utils


Utils.getQueryObj = (url) => {
  let params = url.split('?')[1]
  if(!params) return null
  params = params.split('&')
  let obj = {}
  let queryObj = {}
  params.map(param => {
    const clean = param.split('=')
    if(!clean[1]) return
    const value = clean[1].replace(/\+/g, ' ')
    obj = {[clean[0]] : value}
    queryObj = Object.assign(queryObj, obj)
  })
  return queryObj
}

Utils.getQueryId = (url) => {
  let id = url.split('/')
  id = id[id.length-1]
  id = id.split('?')
  id = id[0]
  if(!parseInt(id)) return null
  return id
}

Utils.getBodyObj = (req) => {
  let body = []
  return new Promise((resolve, reject) => {
    req.on('data', (chunk) => {
      body.push(chunk)
      body = Buffer.concat(body).toString()
    });
    req.on('end', () => {
      return resolve(JSON.parse(body))
    })
    req.on('error', (e) => { return reject(e.message) })
  })
}

Utils.dbNotExistResponse = () => {
  return Promise.resolve(Object.assign({}, {
    header: {
      code: 404,
      type: 'text/plain',
      message: 'No Content/Database does not exist...',
    }
  }))
}

Utils.successGetResponse = (tweets) => {
  return Promise.resolve(Object.assign({}, {
    body: tweets
  }, {
    header: {
      code: 200,
      type: 'application/json',
      message: 'GET request',
    }
  }))
}

Utils.successTextResponse = (message) => {
  return Promise.resolve(Object.assign({}, {
    body: {
      message,
    }
  }, {
    header: {
      code: 201,
      type: 'text/plain',
      message,
    }
  }))
}

Utils.findTweetById = (id, tweetsArray) => {
  let result = null
  tweetsArray.map(oldTweet => {
    if (id === oldTweet.id) {
       result = oldTweet
    }
  })
 return result
}

Utils.processTweetsObjects = (dataFromFile, reqBody) => {
  let tweetsArray = []
  if(dataFromFile) tweetsArray = JSON.parse(dataFromFile).tweets
  const bodyArray = reqBody.tweets
  const newTweetsArray = tweetsArray.concat(bodyArray)
  const newTweetsObject = {tweets: newTweetsArray.filter(n => n)}
  const result = JSON.stringify(newTweetsObject, null, '\t')
  return Promise.resolve(result)
}
