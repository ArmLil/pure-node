'use strict'
const Boom = require('boom')
const Database = require('./database')
const Utils = require('./utils')

const FAVICON = './public/tweets.pug'

const Handlers = {}
module.exports = Handlers


Handlers.apiDeleteByIdEndpoint = (req, reply) => {
  console.log('Handlers.api DeleteByIdEndpoint', 'method=',req.method, req.url.path)
  const { id } = req.params
    return Database.deleteUpdateTweet(id)
    .then(reply)
    .catch((err) => reply('Opps '+ err))
}

Handlers.apiGetByIdEndpoint = (req, reply) => {
  console.log('Handlers.api GetByIdEndpoint', 'method=',req.method, req.url.path)
  const { id } = req.params
    return Database.getTweetById(id)
    .then((tweet) => reply(tweet))
    .catch((err) => reply('Opps '+ err))
}

Handlers.apiUpdateEndpoint = (req, reply) => {
  console.log('Handlers api UpdateEndpoint', 'method=',req.method, req.url.path)
  const { payload, params } = req
  console.log('payload',payload, 'id',params.id)
  return Database.updateTweets(payload, params.id)
  .then(reply)
  .catch((err) => reply('Opps ' + err))
}

Handlers.apiCreateEndpoint = (req, reply) => {
  console.log('apiCreateEndpoint', 'method=',req.method, req.url.path)
  const { payload } = req
  return Database.addTweets(payload)
  .then(reply)
  .catch((err) => reply('Opps ' + err))
}

Handlers.apiTweetsEndpoint = (req, reply) => {
  console.log('apiTweetsEndpoint', 'method=',req.method, req.url.path)
  return Database.getTweets()
  .then(reply)
  .catch((err) => reply('Opps ' + err))
}

Handlers.rootEndpoint = (req, reply) => {
  console.log('Handlers.rootEndpoint', 'method=',req.method, req.url.path)
  return Database.getTweets()
  .then(tweets => {
    reply.view('tweets', tweets)
  })
  .catch((err) => reply('Opps ' + err))
}

Handlers.createEndpoint = (req, reply) => {
  console.log('Handlers.createEndpoint', 'method=',req.method, req.url.path,'payload', req.payload)
  const tweet = {
    user: req.payload.user,
    tweet: req.payload.tweet,
  }
  return Database.addTweets({tweets: [tweet]})
  .then(reply.redirect('/'))
  .catch((err) => reply(Boom.badRequest(err)))
}

Handlers.updateEndpoint = (req, reply) => {
  console.log('Handlers.updateEndpoint', 'method=',req.method, req.url.path, 'payload', req.payload)
  const tweet = {
    user: req.payload.user,
    tweet: req.payload.tweet,
  }
  const { id } = req.params
  return Database.updateTweets(tweet, id)
  .then(reply.redirect('/'))
  .catch((err) => {
    return reply(Boom.badRequest(err))
  })
}

Handlers.deleteEndpoint = (req, reply) => {
  console.log('Handlers.deleteEndpoint', 'method=',req.method, req.url.path)
  const { id } = req.params
  return Database.deleteUpdateTweet(id)
  .then(reply.redirect('/'))
  .catch((err) => reply(Boom.badRequest(err)))
}

Handlers.getByIdEndpoint = (req, reply) => {
  console.log('Handlers.getEndpoint', 'method=',req.method, req.url.path)
  const { id } = req.params
  return Database.getTweetById(id)
    .then((tweet) => reply.view('single', tweet))
    .catch((err) => reply(Boom.badRequest(err)))
}
