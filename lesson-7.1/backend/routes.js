const Joi = require('joi')
const Database = require('./database')
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
  handler: Handlers.apiTweetsEndpoint,
  config: {
    validate: {
      query: {
        offset: Joi.number().min(0).default(0),
        limit: Joi.number().min(1).max(20).default(10)
      }
    },
    description: 'This loads the homepage',
    notes: 'We worked very hard on this endpoint, ha ha!!!',
    tags : ['api']
  }
})

Routes.push({
  method: 'GET',
  path: '/paginate',
  handler: Handlers.apiTweetsPaginateEndpoint,
  config: {
    validate: {
      query: {
        offset: Joi.number().min(0).default(0),
        limit: Joi.number().min(1).max(50).default(10)
      }
    },
    description: 'This loads the homepage',
    notes: 'We worked very hard on this endpoint, ha ha!!!',
    tags : ['api']
  }
})

Routes.push({
  method: 'DELETE',
  path: '/api/tweets/{id}',
  handler: Handlers.apiDeleteByIdEndpoint,
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
  handler: Handlers.apiGetByIdEndpoint,
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
  handler: Handlers.apiUpdateEndpoint,
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
  handler: Handlers.apiCreateEndpoint,
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
  handler: Handlers.rootEndpoint,
  config: {
    validate: {
      query: {
        offset: Joi.number().min(0).default(0),
        limit: Joi.number().min(1).max(50).default(10)
      }
    },
    description: 'This loads the homepage',
    tags : ['template']
  }
})

// Routes.push({
//   method: 'GET',
//   path: '/{id}',
//   handler: Handlers.getByIdEndpoint,
//   config: {
//     validate: {
//       params: {
//         id: Joi.string().required()
//       }
//     },
//     description: 'This loads single tweet',
//     tags : ['template']
//   }
// })

Routes.push({
  method: 'POST',
  path: '/create',
  config: {
    handler: Handlers.createEndpoint,
    validate: {
      payload: {
        user: Joi.string().required().min(3).max(255),
        tweet: Joi.string().required().min(2).max(140),
      }
    },
    description: 'This creates tweet in db',
    notes: 'It is written without promises!!!',
    tags : ['template']
  }
})

Routes.push({
  method: 'POST',
  path: '/update/{id}',
  handler: Handlers.updateEndpoint,
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
  handler: Handlers.deleteEndpoint,
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
