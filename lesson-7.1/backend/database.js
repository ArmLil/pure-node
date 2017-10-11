'use strict'
const fs = require ('fs')
const sqlite3 = require('sqlite3').verbose()

const DB = require('./tweets.sql.js')
const Utils = require('./utils')
const MESSAGES = require('./messages')

const Database = {}
module.exports = Database

//connect to database
const sqlite = new sqlite3.Database('tweets.db', (err) => {
  if (err) {
    console.error(MESSAGES.sqliteDb.error+err.message);
  }
  console.log(MESSAGES.sqliteDb.success)
})

//creates table if db or table not exist
sqlite.run(DB.createTable)

Database.segmentsNumber = (offset, limit) => {
  console.log('segmentsNumber')
  return Database.countTweets()
  .then((result) => {
    const { count } = result
    console.log({count}, {offset}, {limit})
    const segmentsNumberLocal = Math.ceil((count - offset)/limit)
    console.log({segmentsNumberLocal})
    return segmentsNumberLocal
  })
  .catch(err => console.log(err))
}

Database.getTweets = (offset, limit) => {
  console.log('Database.getTweets', offset, limit)
  //offset=`${offset === 0 ? 1 : offset * limit}`
  //segmentsNumber(offset, limit)
  return new Promise((resolve, reject) => {
    sqlite.all(DB.selectTweets(offset, limit), (err, result) => {
      if(err) return reject(MESSAGES.readFile.error+err.message)
      const tweetsObj = {tweets:result}
      return resolve(tweetsObj)
    })
  })
}

Database.getTweetById = (id) => {
  console.log('Database.getTweetById', id)
  return new Promise((resolve, reject) => {
    sqlite.get(DB.selectTweetById(id), (err, tweet) => {
      if(err) return reject(MESSAGES.readFile.error+err.message)
      return resolve(tweet)
    })
  })
}

Database.addTweet = (tweet) => {
  console.log('Database.addTweet', tweet)
  tweet.colour = Utils.randomColor()
  return new Promise((resolve, reject) => {
    sqlite.run(DB.insert(tweet), (err) => {
      if (err) return reject(MESSAGES.dataPostAdd.error+err.message)
      return resolve(MESSAGES.dataPostAdd.success)
    })
  })
}

Database.updateTweets = (tweet, id) => {
  console.log('database updateTweets',tweet, id)
  return new Promise((resolve, reject) => {
    sqlite.run(DB.update(tweet, id), (err) => {
      if(err) return reject(MESSAGES.dataUpdate.error+err.message)
      return resolve(MESSAGES.dataUpdate.success)
    })
  })
}

Database.deleteUpdateTweet = (id) => {
  console.log('deleteUpdateTweet')
  return new Promise((resolve, reject) => {
    sqlite.run(DB.deleteUpdate(id), (err, tweet) => {
      if(err) return reject(MESSAGES.dataDelete.error+err.message)
      return resolve(MESSAGES.dataDelete.success)
    })
  })
}

Database.countTweets = () => {
  return new Promise((resolve, reject) => {
    sqlite.get(DB.count(), (err, result) => {
      if(err) return reject('count err', err)
      return resolve(result.count)
    })
  })
}
