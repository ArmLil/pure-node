'use strict'

const sqlite3 = require('sqlite3').verbose()

const DB = require('./tweets.sql.js')
const Utils = require('./utils')
const MESSAGES = require('./messages')

const TABLE_NAME = 'tweetsTable'
const COLUMNS = ['user', 'tweet', 'colour']


const spawnTweets = (i) => {
  console.log(`('user'${i}, 'tweet'${i}, '${Utils.randomColor()}')`)
  let values = `('user${i}', 'tweet${i}', '${Utils.randomColor()}')`
  return `
   INSERT INTO ${TABLE_NAME}
   (${COLUMNS.join(', ')})
   VALUES ${values}`
}


const sqliteDb = new sqlite3.Database('tweets.db', (err) => {
  if (err) {
    console.error(MESSAGES.sqliteDb.errorerr.message);
  }
  console.log(MESSAGES.sqliteDb.success)

  // const addTweet = (i) => {
  //   return new Promise((resolve, reject) => {
  //     console.log('Database.addTweet', i)
  //     sqliteDb.run(spawnTweets(i), (err) => {
  //       if (err) return reject(err.message)
  //       return resolve('added')
  //     })
  //   })
  // }

  const countTweets = () => {
    return new Promise((resolve, reject) => {
      sqliteDb.get(`SELECT COUNT(*) AS count FROM ${TABLE_NAME}`, (err, result) => {
        if(err) return reject('count err', err)
        return resolve(result)
      })
    })
  }

  return countTweets()
  .then((result) => {
    console.log(result.count)
  })

  // for(let i=1001;i<=1500;++i) {
  //   addTweet(i)
  // }

  sqliteDb.close()
})
