'use strict'

const sqlite3 = require('sqlite3').verbose()

const DB = require('./tweets.sql.js')
const Utils = require('./utils')
const MESSAGES = require('./messages')

const TABLE_NAME = 'tweetsTable'
const COLUMNS = ['user', 'tweet', 'colour']


const sqlite = new sqlite3.Database('tweets.db', (err) => {
  if (err) {
    console.error(MESSAGES.sqliteDb.errorerr.message);
  }
  console.log(MESSAGES.sqliteDb.success)
})

//creates table if db or table not exist
sqlite.run(DB.createTable)

const spawnTweets = (i) => {
  console.log(`('user'${i}, 'tweet'${i}, '${Utils.randomColor()}')`)
  let values = `('user${i}', 'tweet${i}', '${Utils.randomColor()}')`
  return `
   INSERT INTO ${TABLE_NAME}
   (${COLUMNS.join(', ')})
   VALUES ${values}`
}


const addTweet = (i) => {
  return new Promise((resolve, reject) => {
    console.log('Database.addTweet', i)
    sqlite.run(spawnTweets(i), (err) => {
      if (err) return reject(err.message)
      return resolve('added')
    })
  })
}

const count = `SELECT count(*) FROM TABLE_NAME`

console.log(count)

const countTweets = sqlite.get(count, (err) => {
    if (err) return err.message
  })

console.log({countTweets});

// for(let i=1001;i<=1500;++i) {
//   addTweet(i)
// }

sqlite.close()
