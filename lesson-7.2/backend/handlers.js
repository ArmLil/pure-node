'use strict'
const Boom = require('boom')
const Database = require('./database')
const Utils = require('./utils')

const Handlers = {}
module.exports = Handlers


Handlers.root = (req, reply) => {
  reply.redirect('/search')
  .catch((err) => reply(Utils.handleBoom(err)))
}

Handlers.search = (req, reply) => {
  let { offset, limit } = req.query
  let pagination = {}
  return Database.countTweets()
  .then((count) => {
    pagination = Object.assign(
      {},
      {offset},
      {limit},
      {count},
    )
  })
  .then(() => Database.getTweets(offset, limit))
  .then((tweets) => {
    const renderObj = Object.assign({}, pagination, tweets)
    console.log(pagination)
    return reply.view('tweets', renderObj)
  })
  .catch((err) => reply(Utils.handleBoom(err)))
}

Handlers.create = (req, reply) => {
  const tweetsArr = req.payload
  return Database.addTweet({tweets: [tweetsArr]})
  .then(reply.redirect('/search'))
  .catch((err) => reply(Utils.handleBoom(err)))
}

Handlers.update = (req, reply) => {
  const tweet = req.payload
  const { id } = req.params
  return Database.updateTweets(tweet, id)
  .then(reply.redirect('/search'))
  .catch((err) => reply(Utils.handleBoom(err)))
}

Handlers.deleteByID = (req, reply) => {
  const { id } = req.params
  return Database.deleteUpdateTweet(id)
  .then(reply.redirect('/search'))
  .catch((err) => reply(Utils.handleBoom(err)))
}

Handlers.getById = (req, reply) => {
  const { id } = req.params
  return Database.getTweetById(id)
  .then((tweet) => reply.view('single', tweet))
  .catch((err) => reply(Utils.handleBoom(err)))
}
