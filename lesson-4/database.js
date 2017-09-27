'use strict'
const fs = require ('fs')
const sqlite3 = require('sqlite3').verbose()
const Utils = require('./utils')
const Messages = require('./messages')

const TWEETS_PATH = './tweets.json'
const DB = require('./tweets.sql.js')
const Database = {}
module.exports = Database

Database.sql = new sqlite3.Database('tweets.db')

const createTable = () => {
  return new Promise((resolve, reject) => {
    Database.sql.run(DB.createTable, (error, response) => {
      if (error){
        return reject(error)
      }
      return resolve(response)
    })
  })
}

const connect = (table) => {
  return new Promise((resolve, reject) => {
    Database.sql.run(`SELECT * from ${DB.tableName}`, (error, response) => {
      console.log('connect', DB.tableName, response)
      if(error) {
        return createTable()
      }
      return resolve(response)
    })
  })
}

connect(DB.TABLE_NAME)
.then(console.log)
.catch(console.error)



const writeFile = (data, message) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(TWEETS_PATH, data, (err) => {
      if (err) return reject(message.error, err)
    })
    return resolve(message.success)
  })
}

Database.tweets = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(TWEETS_PATH, 'utf8', (err, data) => {
      if (err) return reject(Messages.readFile.error, err)
      resolve(data)
    })
  })
}

Database.tweetsArray = () => {
  return Database.tweets()
  .then((dataFromDb) => {
    let tweets = []
    if (dataFromDb) tweets = JSON.parse(dataFromDb).tweets
    return tweets
  })
}

Database.addTweets = (tweetsObj) => {
  const insertValues = tweetsObj.tweets.map((tweet, index) => {
    tweet = Utils.addColorTweet(tweet)
    console.log('addTweets', tweet)
    let result = '('
    result += `'${tweet.user}', '${tweet.tweet}', '${tweet.color}'`
    if (index === tweetsObj.tweets.length-1) result += ')'
    else result += '),'
    return result
  })

  return  Database.sql.run(`INSERT INTO ${DB.tableName} (${DB.columns.join(', ')}) VALUES ${insertValues}`, (error, response) => {
    if(error) {
      console.error(error)
    }
    console.log(response)
  })

  // return Database.tweetsArray()
  // .then((tweetsArray) => Utils.joinTweets(tweetsArray,reqBody.tweets))
  // .then((result) => {
  //   let { notValidTweets, newTweetsObject } = result
  //   let { message } = Messages.dataPostAdd
  //   if (notValidTweets) {
  //     notValidTweets = JSON.stringify(notValidTweets, null, '\t')
  //     message = Messages.notValidTweets
  //     message.success += notValidTweets
  //   }
  //   newTweetsObject = JSON.stringify(newTweetsObject, null, '\t')
  //   return writeFile(newTweetsObject, message)
  // })
}

Database.updateTweets = (newTweet) => {
  return Database.tweetsArray()
  .then((tweetsArray) => {
    if (!Utils.findTweetById(newTweet.id, tweetsArray))
      return Promise.reject(Messages.id.error)
    let newTweetsArray = Utils.updateTweet(newTweet, tweetsArray)
    const newTweetsObject = {tweets: newTweetsArray.filter(n => n)}
    const result = JSON.stringify(newTweetsObject, null, '\t')
    return writeFile(result, Messages.dataUpdate)
  })
}

Database.deleteTweet = (id) => {
  return Database.tweetsArray()
  .then((tweetsArray) => {
    if (!Utils.findTweetById(id, tweetsArray))
      return Promise.reject(Messages.id.error)
    let newTweetsArray = Utils.deleteTweetById(id, tweetsArray)
    const newTweetsObject = {tweets: newTweetsArray.filter(n => n)}
    const result = JSON.stringify(newTweetsObject, null, '\t')
    return writeFile(result, Messages.dataDelete)
  })
}

Database.getTweetById = (id) => {
  return Database.tweetsArray()
  .then((tweetsArray) => {
    const tweet = Utils.findTweetById(id, tweetsArray)
    if (!tweet) return Promise.reject(Messages.tweet.error)
    return {tweets: [tweet]}
  })
}
