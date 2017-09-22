const fs = require ('fs')

const Database = {}
module.exports = Database

const Utils = require('./utils')
const TWEETS_PATH = './tweets.json'
const Messages = require('./messages')

Database.tweets = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(TWEETS_PATH, 'utf8', (err, data) => {
      if (err) return reject(Messages.readFile.error, err)
      resolve(data)
    });
  });
}

Database.appendFile = (body,message) => {
  return new Promise((resolve, reject) => {
    fs.appendFile(TWEETS_PATH, body, (err) => {
      if (err) return reject(message.error,err)
    })
    return resolve(message.success)
  })
}

Database.writeFile = (data, message) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(TWEETS_PATH, data, (err) => {
      if (err) return reject(message.error, err)
    })
    return resolve(message.success)
  })
}

Database.createFile = (reqBody) => {
  return Utils.processTweetsObjects(null,reqBody)
  .then((result) => Database.appendFile(result, Messages.dataPostCreate))
}

Database.addTweets = (reqBody) => {
  return Database.tweets()
  .then((dataFromFile) => Utils.processTweetsObjects(dataFromFile,reqBody))
  .then((result) => Database.writeFile(result, Messages.dataPostAdd))
}

Database.updateTweet = (newTweet, method) => {
  let findTweetById = false
  return Database.tweets(TWEETS_PATH)
  .then((data) => {
    let tweetsArray = JSON.parse(data).tweets
    let newTweetsArray = tweetsArray.map(oldTweet => {
      if (newTweet.id === oldTweet.id) {
        findTweetById = true
        if(method === 'PUT')
          return oldTweet = Object.assign({}, oldTweet, newTweet)
        else if (method === 'DELETE')
          return null
      }
      return oldTweet
    })
    const newTweetsObject = {tweets: newTweetsArray.filter(n => n)}
    const result = JSON.stringify(newTweetsObject, null, '\t')
    if(!findTweetById) return Promise.reject(Messages.tweet.error)
    if (method === 'PUT')
      return Database.writeFile(result, Messages.dataUpdate)
    else if (method === 'DELETE')
      return Database.writeFile(result, Messages.dataDelete)
  })
}

Database.updateFile = (req) => {
  const { url, method } = req
  const id = Utils.getQueryId(url)
  const queryObj = Utils.getQueryObj(url)
  if(!id) return Promise.reject(Messages.id.error)
  const tweetObj = Object.assign({}, queryObj, {id})
  return Database.updateTweet(tweetObj, method)
}
