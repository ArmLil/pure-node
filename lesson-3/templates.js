const pug = require('pug')
const Database = require('./database')
const fs = require ('fs')

const Templates = {}
module.exports = Templates

const TWEETS_TEMPLATE = './public/tweets.pug'
const TWEETS_PATH = './tweets.json'

const responseObj = (tweets, message) => {
  return Promise.resolve(Object.assign({}, {
    body: pug.renderFile(TWEETS_TEMPLATE, tweets)
  }, {
    header: {
      code: 200,
      type: 'text/html',
      message,
    }
  }))
}

Templates.homePage = (req) => {
  const fileExists = fs.existsSync(TWEETS_PATH)
  if(!fileExists) {
    return responseObj({'tweets': []},'Database does not exist...')
  }
  else return Database.tweets()
  .then(tweets => {
    if(!tweets) return ({
      tweets: []
    })
    return JSON.parse(tweets)
  })
  .then(tweets => responseObj(tweets, 'GET request'))
}
