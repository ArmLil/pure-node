'use strict'
const fs = require ('fs')
const pug = require('pug')

const TWEETS_TEMPLATE = './public/tweets.pug'
const SINGLE_TEMPLATE = './public/single.pug'
const TWEETS_PATH = './tweets.json'

const Templates = {}
module.exports = Templates

const handlebars = require('handlebars')

const data = (tweets) => {
  const tweetsObj = JSON.parse(tweets)
  return {
    title: 'Rendered with handlebars',
    author: 'll',
    tags: tweetsObj.tweets
  }
}

data.body = process.argv[2];

const renderTemplate = (tweets) => {
  return new Promise((resolve, reject) => {
    fs.readFile('./public/handlebars-example.html', 'utf-8', function(error, source) {
      if (error) return reject(error)
      handlebars.registerHelper('custom_title', function(title){
        return title;
      })
      const template = handlebars.compile(source);
      const html = template(data(tweets));
      return resolve(html)
    });
  })
}

Templates.renderHomePage = (tweets, message) => {
  return renderTemplate(tweets)
  .then((html) => {
    return Object.assign({}, {
      body: html
    }, {
      header: {
        code: 200,
        type: 'text/html',
        message,
      }
    })
  })
}


Templates.renderSinglePage = (tweet, message) => {
  return Promise.resolve(Object.assign({}, {
    body: pug.renderFile(SINGLE_TEMPLATE, tweet)
  }, {
    header: {
      code: 200,
      type: 'text/html',
      message,
    }
  }))
}
