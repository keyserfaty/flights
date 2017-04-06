'use strict';

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _twillio = require('./services/twillio');

var _twillio2 = _interopRequireDefault(_twillio);

var _cron = require('cron');

var _cron2 = _interopRequireDefault(_cron);

var _api = require('./services/api');

var _api2 = _interopRequireDefault(_api);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _parsers = require('./parsers');

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fail = function fail(msg) {
  return console.log(msg);
};
var msg = function msg(_msg) {
  return console.log(_msg);
};

var getFlightsFromServices = (0, _co2.default)(regeneratorRuntime.mark(function _callee() {
  var urlsList, getFlights, flightsList, parsedFlightsResponse, flightsPost, flightsPostResponse, bestPrice, i, flight;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // 1. Get flights for this dates
          urlsList = _config2.default.dest.map(function (d) {
            return _config2.default.almundo + '?adults=1&date=2017-07-16,2017-07-26&from=BUE,' + d + '&to=' + d + ',BUE';
          });
          getFlights = urlsList.reduce(function (res, url) {
            var each = new Promise(function (resolve, reject) {
              (0, _request2.default)(url, function (error, response, body) {
                if (error) return reject(error);
                return resolve(body);
              });
            });

            res.push(each);
            return res;
          }, []);

          // Parse flights response for the format that my DB needs

          _context.next = 4;
          return getFlights;

        case 4:
          flightsList = _context.sent;
          parsedFlightsResponse = flightsList.map(function (flight) {
            return {
              flight: (0, _parsers.getLowerPrices)(JSON.parse(flight)),
              price: (0, _parsers.getLowerPrice)((0, _parsers.getLowerPrices)(JSON.parse(flight))),
              timestamp: Date.now()
            };
          });

          // 2. Post flights to Firebase

          flightsPost = parsedFlightsResponse.reduce(function (res, flight) {
            var each = (0, _api2.default)({ method: 'post', path: 'flights' }, flight);

            res.push(each);
            return res;
          }, []);
          _context.next = 9;
          return flightsPost;

        case 9:
          flightsPostResponse = _context.sent;

          msg('--- Successfully saved flights response to firebase --- \n' + JSON.stringify(flightsPostResponse, null, 2));

          // 3. Get best historical price
          _context.next = 13;
          return (0, _api2.default)({ method: 'get', path: 'best' });

        case 13:
          bestPrice = _context.sent;

          msg('--- Successfully brought best historical price ---');

          i = 0;

        case 16:
          if (!(i < flightsList.length)) {
            _context.next = 29;
            break;
          }

          flight = JSON.parse(flightsList[i]);

          if (!((0, _parsers.getLowerPrice)((0, _parsers.getLowerPrices)(flight)) < bestPrice['-KgvWRGTI1jgRhXssfdi'].price)) {
            _context.next = 25;
            break;
          }

          _context.next = 21;
          return (0, _api2.default)({ method: 'put', path: 'best/-KgvWRGTI1jgRhXssfdi' }, flight);

        case 21:

          _twillio2.default.sendSms('Ding ding ding! $' + (0, _parsers.getLowerPrice)((0, _parsers.getLowerPrices)(flight)));
          msg('--- Ding ding ding! Found a best price and texted the user ---');
          _context.next = 26;
          break;

        case 25:
          msg('--- No best price find in batch :( ---');

        case 26:
          i++;
          _context.next = 16;
          break;

        case 29:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, this);
}));

new _cron2.default.CronJob('*/15 * * * *', function () {
  console.log('--- Starting a new batch at ' + Date.now() + ' ---');
  getFlightsFromServices;
}, null, true, 'America/Los_Angeles');