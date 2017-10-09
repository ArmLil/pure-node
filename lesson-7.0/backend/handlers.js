'use strict'
const Boom = require('boom')
const Database = require('./database')
const FAVICON = './public/tweets.pug'

const Handlers = {}
module.exports = Handlers


Handlers.apiDeleteByIdEndpoint = (req, reply) => {
  console.log('Handlers.api DeleteByIdEndpoint', 'method=',req.method, req.url.path)
  const { id } = req.params
  return Database.deleteUpdateTweet(id)
  .then(reply)
  .catch((err) => reply(err.message))
}

Handlers.apiGetByIdEndpoint = (req, reply) => {
  console.log('Handlers.apiGetByIdEndpoint', 'method=',req.method, req.url.path)
  const { id } = req.params
  return Database.getTweetById(id)
  .then((tweet) => reply(tweet))
  .catch((err) => reply(Boom.badRequest(err.message)))
}

Handlers.apiUpdateEndpoint = (req, reply) => {
  console.log('Handlers api UpdateEndpoint', 'method=',req.method, req.url.path)
  const { payload, params } = req
  return Database.updateTweets(payload, params.id)
  .then(reply)
  .catch((err) => reply(Boom.badRequest(err.message)))
}

Handlers.apiCreateEndpoint = (req, reply) => {
  console.log('apiCreateEndpoint', 'method=',req.method, req.url.path)
  const { payload } = req
  console.log(payload)
  return Database.addTweet(payload)
  .then(reply)
  .catch((err) => reply(Boom.badRequest(err.message)))
}

Handlers.apiTweetsEndpoint = (req, reply) => {
  console.log('apiTweetsEndpoint', 'method=',req.method, req.url.path)
  console.log('query', req.query)
  const { offset, limit } = req.query
  return Database.getTweets(offset, limit)
  .then((tweets) => reply(tweets))
  .catch((err) => reply(Boom.badRequest(err.message)))
}

Handlers.rootEndpoint = (req, reply) => {
  console.log('Handlers.rootEndpoint', 'method=',req.method, req.url.path)
  const { offset, limit } = req.query
  return Database.getTweets(offset, limit)
  .then((tweets) => reply.view('tweets', tweets))
  .catch((err) => reply(Boom.badRequest(err.message)))
}

Handlers.createEndpoint = (req, reply) => {
  console.log('Handlers.createEndpoint', 'method=',req.method, req.url.path,'payload', req.payload)
  const tweetsArr = req.payload
  return Database.addTweet({tweets: [tweetsArr]})
  .then(reply.redirect('/'))
  .catch((err) => reply(Boom.badRequest(err.message)))
}

Handlers.updateEndpoint = (req, reply) => {
  console.log('Handlers.updateEndpoint', 'method=',req.method, req.url.path, 'payload', req.payload)
  const tweet = req.payload
  const { id } = req.params
  return Database.updateTweets(tweet, id)
  .then(reply.redirect('/'))
  .catch((err) => reply(Boom.badRequest(err.message)))
}

Handlers.deleteEndpoint = (req, reply) => {
  console.log('Handlers.deleteEndpoint', 'method=',req.method, req.url.path)
  const { id } = req.params
  return Database.deleteUpdateTweet(id)
  .then(reply.redirect('/'))
  .catch((err) => reply(Boom.badRequest(err.message)))
}

Handlers.getByIdEndpoint = (req, reply) => {
  console.log('Handlers.getByIdEndpoint', 'method=',req.method, req.url.path)
  const { id } = req.params
  return Database.getTweetById(id)
  .then((tweet) => reply.view('single', tweet))
  .catch((err) => reply(Boom.badRequest(err.message)))
}
