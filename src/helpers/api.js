import request from 'request'
import { cfg } from '../config'

const api = (opt, obj) => {
  const req = {
    method: opt.method,
    url: cfg['FIREBASE'] + opt.path + '.json',
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
