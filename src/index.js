import request from 'request'
import twillio from './services/twillio'
import CronJob from 'cron'
import api from './services/api'
import config from './config'
import parsers from './parsers'

const query = config.dest.map(d => `${config.almundo}?adults=1&date=2017-07-16,2017-07-26&from=BUE,${d}&to=${d},BUE`)

const getFlightsFromService = query => {
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

console.log('here')
//
//new CronJob.CronJob('*/15 * * * *', function() {
//  console.log('--- Starting a new batch at ' + Date.now() + ' ---')
//  getFlightsFromService(query)
//}, null, true, 'America/Los_Angeles');