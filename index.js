var request = require('request');
var twillio = require('./services/twillio')
var CronJob = require('cron').CronJob;
var api = require('./services/api')
var config = require('./config')
var parsers = require('./parsers')

var query = config.dest.map(d => `${config.almundo}?adults=1&date=2017-07-16,2017-07-26&from=BUE,${d}&to=${d},BUE`)

var getFlightsFromService = query => {
  api({
    method: 'get',
    path: 'best'
  })
  .then(bestPrice => {
    query.map(url => {
      request(url, function (error, response, body) {
        var res = JSON.parse(body)
        var bodyRes = {
          flight: parsers.getLowerPrices(res),
          query: url,
          price: parsers.getLowerPrice(parsers.getLowerPrices(res)),
          timestamp: Date.now()
        }

        api({
          method: 'post',
          path: 'flights',
        }, bodyRes)

        if (parsers.getLowerPrice(parsers.getLowerPrices(res)) < bestPrice['-KgvWRGTI1jgRhXssfdi'].price) {
          api({
            method: 'put',
            path: 'best/-KgvWRGTI1jgRhXssfdi',
          }, bodyRes)

          twillio.sendSms('Ding ding ding! $' + parsers.getLowerPrice(parsers.getLowerPrices(res)))
        }
      });
    })
  })
}

new CronJob('*/15 * * * *', function() {
  getFlightsFromService(query)
}, null, true, 'America/Los_Angeles');