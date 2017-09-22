const pug = require('pug')
const fs = require ('fs')

const Templates = {}
module.exports = Templates

const Database = require('./database')
const Utils = require('./utils')

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


Templates.homePage = (req, dataFromFile) => {
  let tweetsArray = []
  if(dataFromFile) tweetsArray = JSON.parse(dataFromFile).tweets

  const id = Utils.getQueryId(req.url)
  if(id) {
   let tweet = Utils.findTweetById(id, tweetsArray)
   return responseObj({tweets:[tweet]}, 'GET request')
 }
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
