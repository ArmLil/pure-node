const Joi = require('joi')

const Database = require('./database')
const Api = require('./api')
const Handlers = require('./handlers')
const Utils = require('./utils')

const Routes = []
module.exports = Routes

Routes.push({
  method: 'GET',
  path: '/{param*}',
  handler: {
    directory: {
      path: '.',
      redirectToSlash: true,
      index: true,
    }
  }
})

Routes.push({
  method: 'GET',
  path: '/api/tweets',
  handler: Api.getTweets,
  config: {
    validate: {
      query: {
        offset: Joi.number().min(0).default(0),
        limit: Joi.number().min(1).max(20).default(10)
      }
    },
    description: 'This gets tweets in json format',
    notes: 'We worked very hard on this endpoint, ha ha!!!',
    tags : ['api']
  }
})

Routes.push({
  method: 'DELETE',
  path: '/api/tweets/{id}',
  handler: Api.deleteById,
  config: {
    validate: {
      params: {
        id: Joi.string().required()
      }
    },
    description: 'This deletes tweet by its id',
    tags : ['api']
  }
})

Routes.push({
  method: 'GET',
  path: '/api/tweets/{id}',
  handler: Api.getById,
  config: {
    validate: {
      params: {
        id: Joi.string().required()
      }
    },
    description: 'This gets tweet by its id',
    tags : ['api']
  }
})

Routes.push({
  method: 'PUT',
  path: '/api/tweets/{id}',
  handler: Api.update,
  config: {
    validate: {
      payload: {
        user: Joi.string().required().min(3).max(255),
        tweet: Joi.string().required().min(2).max(140),
      },
      params: {
        id: Joi.string().required()
      }
    },
    description: 'This updates tweet by request body',
    tags : ['api']
  }
})

Routes.push({
  method: 'POST',
  path: '/api/tweets',
  handler: Api.create,
  config: {
    validate: {
      payload: {
        user: Joi.string().required().min(3).max(255),
        tweet: Joi.string().required().min(2).max(140),
      }
    },
    description: 'This creates tweet by requset body',
    tags : ['api']
  }
})

Routes.push({
  method: 'GET',
  path: '/',
  handler: Handlers.root,
  config: {
    description: 'This loads the homepage',
    tags : ['template']
  }
})

Routes.push({
  method: 'GET',
  path: '/search',
  handler: Handlers.search,
  config: {
    validate: {
      query: {
        offset: Joi.number().min(0).default(0),
        limit: Joi.number().min(1).max(50).default(5)
      }
    },
    description: 'This loads the homepage',
    notes: 'We worked very hard on this endpoint, ha ha!!!',
    tags : ['api']
  }
})

Routes.push({
  method: 'GET',
  path: '/search/{id}',
  handler: Handlers.getById,
  config: {
    validate: {
      params: {
        id: Joi.string().required()
      }
    },
    description: 'This loads single tweet',
    tags : ['template']
  }
})

Routes.push({
  method: 'POST',
  path: '/create',
  config: {
    handler: Handlers.create,
    validate: {
      payload: {
        user: Joi.string().required().min(3).max(255),
        tweet: Joi.string().required().min(2).max(140),
      }
    },
    description: 'This creates tweet in db',
    notes: 'It is written with promises!!!',
    tags : ['template']
  }
})

Routes.push({
  method: 'POST',
  path: '/update/{id}',
  handler: Handlers.update,
  config: {
    description: 'This updates tweet by its id',
    tags : ['template'],
    validate: {
      params: {
        id: Joi.string().required()
      },
      payload: {
        user: Joi.string().min(3).max(255),
        tweet: Joi.string().min(2).max(140),
      }
    }
  }
})

Routes.push({
  method: 'POST',
  path: '/delete/{id}',
  handler: Handlers.deleteByID,
  config: {
    description: 'This deletes tweet by its id',
    tags : ['template'],
    validate: {
      params: {
        id: Joi.string().required()
      }
    }
  }
})
