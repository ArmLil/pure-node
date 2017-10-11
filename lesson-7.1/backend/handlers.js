'use strict'
const Boom = require('boom')
const Database = require('./database')
const Utils = require('./utils')
const FAVICON = './public/img/favicon.ico'

const Handlers = {}
module.exports = Handlers


Handlers.apiDeleteByIdEndpoint = (req, reply) => {
  console.log('Handlers.api DeleteByIdEndpoint', 'method=',req.method, req.url.path)
  const { id } = req.params
  return Database.deleteUpdateTweet(id)
  .then(reply)
  .catch((err) => reply(Boom.badRequest(err)))
}

Handlers.apiGetByIdEndpoint = (req, reply) => {
  console.log('Handlers.apiGetByIdEndpoint', 'method=',req.method, req.url.path)
  const { id } = req.params
  return Database.getTweetById(id)
  .then((tweet) => reply(tweet))
  .catch((err) => reply(Boom.badRequest(err)))
}

Handlers.apiUpdateEndpoint = (req, reply) => {
  console.log('Handlers api UpdateEndpoint', 'method=',req.method, req.url.path)
  const { payload, params } = req
  return Database.updateTweets(payload, params.id)
  .then(reply)
  .catch((err) => reply(Boom.badRequest(err)))
}

Handlers.apiCreateEndpoint = (req, reply) => {
  console.log('apiCreateEndpoint', 'method=',req.method, req.url.path)
  const { payload } = req
  console.log(payload)
  return Database.addTweet(payload)
  .then(reply)
  .catch((err) => reply(Boom.badRequest(err)))
}

Handlers.apiTweetsEndpoint = (req, reply) => {
  console.log('apiTweetsEndpoint', 'method=',req.method, req.url.path)
  console.log('query', req.query)
  const { offset, limit } = req.query
  return Database.getTweets(offset, limit)
  .then((tweets) => reply(tweets))
  .catch((err) => reply(Boom.badRequest(err)))
}

Handlers.rootEndpoint = (req, reply) => {
  console.log('Handlers.rootEndpoint', 'method=',req.method, req.url.path)
  const { offset, limit } = req.query
  return Database.getTweets(offset, limit)
  .then((tweets) => reply.view('tweets', tweets))
  .catch((err) => reply(Boom.badRequest(err)))
}

// Handlers.apiTweetsPaginateEndpoint = (req, reply) => {
//   console.log('Handlers.apiTweetsPaginateEndpoint', 'method=',req.method, req.url.path)
//   const { offset, limit } = req.query
//   let segments
//   Database.countTweets()
//   .then((result) => segments=result)
//   const pagination = Object.assign({}, {offset}, {limit}, {segments})
//   console.log(pagination)
//   return Database.getTweets(offset, limit)
//   .then((tweets) => reply.view('pagination', tweets, pagination))
//   .catch((err) => {
//      reply(Boom.badRequest(err))
//     // reply(Utils.handleBoom(err))
//   })
// }

Handlers.apiTweetsPaginateEndpoint = (req, reply) => {
  console.log('Handlers.apiTweetsPaginateEndpoint', 'method=',req.method, req.url.path)
  let { offset, limit } = req.query
  offset = offset === 0 ? 1 : offset * limit
  let pagination = {}
  return Database.countTweets()
  .then((count) =>
    pagination = Utils.getPaginationObj(offset, limit, count))
  .then(() => Database.getTweets(offset, limit))
  .then((tweets) => {
    const renderObj = Object.assign({}, pagination, tweets)
    console.log(pagination)
    return reply.view('pagination', renderObj)
  })
  .catch((err) => reply(Utils.handleBoom(err)))
}

Handlers.createEndpoint = (req, reply) => {
  console.log('Handlers.createEndpoint', 'method=',req.method, req.url.path,'payload', req.payload)
  const tweetsArr = req.payload
  return Database.addTweet({tweets: [tweetsArr]})
  .then(reply.redirect('/'))
  .catch((err) => reply(Boom.badRequest(err)))
}

Handlers.updateEndpoint = (req, reply) => {
  console.log('Handlers.updateEndpoint', 'method=',req.method, req.url.path, 'payload', req.payload)
  const tweet = req.payload
  const { id } = req.params
  return Database.updateTweets(tweet, id)
  .then(reply.redirect('/'))
  .catch((err) => reply(Boom.badRequest(err)))
}

Handlers.deleteEndpoint = (req, reply) => {
  console.log('Handlers.deleteEndpoint', 'method=',req.method, req.url.path)
  const { id } = req.params
  return Database.deleteUpdateTweet(id)
  .then(reply.redirect('/'))
  .catch((err) => reply(Boom.badRequest(err)))
}

Handlers.getByIdEndpoint = (req, reply) => {
  console.log('Handlers.getByIdEndpoint', 'method=',req.method, req.url.path)
  const { id } = req.params
  return Database.getTweetById(id)
  .then((tweet) => reply.view('single', tweet))
  .catch((err) => reply(Boom.badRequest(err)))
}
