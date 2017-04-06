import request from 'request'
import config from '../config'

const api = (opt, obj) => {
  var req = {
    method: opt.method,
    url: config.firebase + opt.path + '.json',
    json: true,
    headers: {
      "content-type": "application/json",
    },
  }

  if (opt.method == 'post' || opt.method == 'put') {
    req.body = obj
  }

  return new Promise((resolve, reject) => {
    request(req, function (err, httpResponse, body) {
      if (err) {
        return reject(body)
      }

      if (opt.method == 'get') {
        console.log('Success getting best historical price!')
      }

      if (opt.method == 'post' || opt.method == 'put') {
        console.log('Success creating a new flight! ' + JSON.stringify(body))
      }

      return resolve(body)
    })
  })
}

module.exports = api
