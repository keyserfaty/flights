var config = require('../config')

var api = (opt, obj) => {
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

      console.log('Success! ' + body)
      return resolve(body)
    })
  })
}

module.exports = api
