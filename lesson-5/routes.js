const Database = require('./database')
const Templates = require('./templates')
const Utils = require('./utils')

const Routes = []
module.exports = Routes


Routes.push({
  method: 'GET',
  path: '/',
  config: {
    handler: (request, reply) => {
      return Database.getTweets()
      .then(tweets => {
        reply.view('tweets', tweets)
      })
      .catch(error => {
        reply(error)
      })
    },
    description: 'This loads the homepage',
    tags : ['template']
  }
})


Routes.push({
  method: 'GET',
  path: '/api/tweets',
  config: {
    handler: (request, reply) => {
      return Database.getTweets()
      .then(reply)
      .catch(error => {
        reply(error)
      })
    },
    description: 'This loads the homepage',
    notes: 'We worked very hard on this endpoint!!!',
    tags : ['api']
  }
})
