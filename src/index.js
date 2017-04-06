import twillio from './services/twillio'
import CronJob from 'cron'
import co from 'co'

import api from './services/api'
import config from './config'
import { msg } from './helpers'

import { getLowerPrice, getLowerPrices } from './parsers'
import { getFlights, getBestPrice } from './services/flights'

const getFlightsFromServices = co(function * () {
  //* Build url list for Almundo
  const urlsList = config.dest.map(d => `${config.almundo}?adults=1&date=2017-07-16,2017-07-26&from=BUE,${d}&to=${d},BUE`)

  // 1. Get flights for this dates
  const flights = yield getFlights(urlsList)

  // 2. Get best historical price
  const bestPrice = yield getBestPrice(flights)

  for (let i = 0; i < flights.length; i++) {
    const flight = JSON.parse(flights[i])

    if (getLowerPrice(getLowerPrices(flight)) < bestPrice['-KgvWRGTI1jgRhXssfdi'].price) {
      yield api({method: 'put', path: 'best/-KgvWRGTI1jgRhXssfdi'}, flight)

      twillio.sendSms('Ding ding ding! $' + getLowerPrice(getLowerPrices(flight)))
      msg('--- Ding ding ding! Found a best price and texted the user ---')
    } else {
      msg('--- No best price find in batch :( ---')
    }
  }
})

//new CronJob.CronJob('*/15 * * * *', function() {
//  console.log('--- Starting a new batch at ' + Date.now() + ' ---')
//  getFlightsFromServices
//}, null, true, 'America/Los_Angeles');
