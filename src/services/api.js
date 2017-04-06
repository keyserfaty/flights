import request from 'request'
import config from '../config'

const api = (opt, obj) => {
  var req = {
    method: opt.method,
    url: config.firebase + opt.path + '.json',
    json: true,
    headers: {
      'content-type': 'application/json',
    },
  }

  if (opt.method === 'POST' || opt.method === 'PUT') {
    req.body = obj
  }

  return new Promise((resolve, reject) => {
    return request(req, function (err, httpResponse, body) {
      if (err) {
        return reject(err)
      }

      return resolve(body)
    })
  })
}

export default api
