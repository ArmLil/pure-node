const pug = require('pug')
const Database = require('./database')
const TWEETS_TEMPLATE = './public/tweets.pug'

const Templates = {}
module.exports = Templates


Templates.homePage = (req) => {
  return Database.tweets()  
  .then(tweets => {
    if(!tweets) return ({
      tweets: []
    })
    return JSON.parse(tweets)
  })
  .then(tweets => {
    console.log(tweets)
    return Promise.resolve(Object.assign({}, {
        body: pug.renderFile(TWEETS_TEMPLATE, tweets)
      }, {
        header: {
          code: 200,
          type: 'text/html',
          message: 'GET request',
        }
      }))
  })
}
