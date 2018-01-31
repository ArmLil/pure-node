'use strict'
const querystring = require('querystring')
const request = require('request-promise')
const tough = require('tough-cookie')
const Boom = require('boom')

const TWEET_ROOT = `http://localhost:4000/api/tweets`

const Handlers = {}
module.exports = Handlers

Handlers.root = (req, reply) => {
  reply.redirect('/search')
}

Handlers.search = (req, reply) => {
  let { offset, limit, user } = req.query
  if (offset % limit !== 0) {
    req.query.offset -= offset % limit
    const queryString = querystring.stringify(req.query)
    return reply.redirect(`/search?${queryString}`)
  }
  const uri = TWEET_ROOT

  let cookie = req.state.sessionSearch
  if(!cookie) {
    cookie = {
      firstvisit: false
    }
  }
  if(user) cookie.username = user

  cookie.lastVisit = Date.now().toLocaleString()
  const options = {
    uri,
    qs: {offset, limit},
    json: true
  }

 return request(options)
  .then((result) => {
    return reply.view('tweets', result).state('sessionSearch', cookie)
  })
  .catch((err) => reply(Boom.badRequest(err.message)))
}

Handlers.create = (req, reply) => {
  const { payload, params } = req
  const query = querystring.parse(params.prev)
  const queryObj = Object.assign({}, query, {user: payload.user})
  params.prev = querystring.stringify(queryObj)

  const uri = TWEET_ROOT
  const options = {
    method: 'POST',
    uri,
    body: payload,
    json: true
  }

  return request(options)
    .then(() => reply().redirect(`/search?${params.prev}`))
    .catch((err) => reply(Boom.badRequest(err.message)))
}

Handlers.update = (req, reply) => {
  const { payload, params } = req
  const { id } = params
  let uri = TWEET_ROOT
  uri += `/${id}`
  const options = {
    method: 'PUT',
    uri,
    body: payload,
    json: true
  }
  return request(options)
    .then(reply.redirect(`/search?${params.prev}`))
    .catch((err) => reply(Boom.badRequest(err.message)))
}

Handlers.deleteByID = (req, reply) => {
  const { params } = req
  const { id } = params
  let uri = TWEET_ROOT
  uri += `/${id}`
  const options = {
    method: 'DELETE',
    uri,
    json: true
  }
  return request(options)
    .then(reply.redirect(`/search?${params.prev}`))
    .catch((err) => reply(Boom.badRequest(err.message)))
}

Handlers.getById = (req, reply) => {
  const { params } = req
  const { id, prev } = params
  let uri = TWEET_ROOT
  uri += `/${id}`
  const options = {
    method: 'GET',
    uri,
    json: true
  }
  return request(options)
    .then((tweet) => reply.view('single', Object.assign(tweet, {prev})))
    .catch((err) => reply(Boom.badRequest(err.message)))
}
