const fs = require ('fs')

const Database = {}
module.exports = Database

const TWEETS_PATH = './tweets.json'

Database.tweets = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(TWEETS_PATH, 'utf8', (err, data) => {      
      if (err) return reject('readFile error', err)
      resolve(data)
    });
  });
}