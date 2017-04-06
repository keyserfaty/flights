'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var api = function api(opt, obj) {
  var req = {
    method: opt.method,
    url: _config2.default.firebase + opt.path + '.json',
    json: true,
    headers: {
      "content-type": "application/json"
    }
  };

  if (opt.method == 'post' || opt.method == 'put') {
    req.body = obj;
  }

  return new Promise(function (resolve, reject) {
    return (0, _request2.default)(req, function (err, httpResponse, body) {
      if (err) {
        return reject(err);
      }

      return resolve(body);
    });
  });
};

exports.default = api;