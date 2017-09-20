const Utils = {}
module.exports = Utils


Utils.getQueryObj = (url) => {
  let params = url.split('?')[1]
  
  if(!params) return null
  
  params = params.split('&')

  let obj = {}
  let queryObj = {}
  
  params.map(param => {
    const clean = param.split('=')
    const value = clean[1].replace(/\+/g, ' ')

    obj = {[clean[0]] : value}
    queryObj = Object.assign(queryObj, obj)
  })

  return queryObj
}


Utils.getBodyObj = (req) => {
  let body = []
  return new Promise((resolve, reject) => {
    req.on('data', (chunk) => {
      body.push(chunk)
      body = Buffer.concat(body).toString()
    });
    req.on('end', () => {
      return resolve(JSON.parse(body))
    })
    req.on('error', (e) => { return reject(e.message) })
  })
}

Utils.requestProcess = (req) => {
  const {body, url, method } = req
  return new Promise((resolve, reject) => {    
    if(method === 'GET') {

      return resolve({
        method: 'GET',
        path: url,
        params: Utils.getQueryObj(url)        
      })

    } 
    else if(method === 'POST') {
      return Utils.getBodyObj(req)
        .then(bodyObj => {
          return resolve({
            method: 'POST',
            path: url,
            body: bodyObj,
          })
        })
    }
  })
}
