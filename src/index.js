import cron from 'cron'
import co from 'co'

import { msg } from './helpers/utils'
import { list as services } from './helpers/queries'

import { getFlights, getBestPrice, alertBestPrice, postBestPrice } from './services/flights'

const getFlightsFromServices = co(function * () {
  // 1. Get flights for this dates
  const flights = yield getFlights(services)

  // 2. Get best historical price
  const bestPrice = yield getBestPrice(flights)

  // 3. If any of the prices coming from search is best
  // alert and replace it in database
  for (let i = 0; i < flights.length; i++) {
    const flight = flights[i]

    msg('Prices for this batch: ' + flight.price + ' ' + bestPrice['-KgvWRGTI1jgRhXssfdi'].price)

    if (flight.price < bestPrice['-KgvWRGTI1jgRhXssfdi'].price) {
      yield postBestPrice(flight)
      yield alertBestPrice(flight)
    } else {
      msg('--- No best price find in batch :( ---')
    }
  }
})

cron.CronJob('*/15 * * * *', function () {
  msg('--- Starting a new batch at ' + Date.now() + ' ---')
  getFlightsFromServices
}, null, true, 'America/Los_Angeles')
