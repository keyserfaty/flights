import request from 'request'
import twillio from './services/twillio'
import CronJob from 'cron'
import api from './services/api'
import config from './config'
import { getLowerPrice, getLowerPrices } from './parsers'
import co from 'co'

const fail = msg => console.log(msg)
const msg = msg => console.log(msg)

const getFlightsFromServices = co(function * () {
  // 1. Get flights for this dates
  const urlsList = config.dest.map(d => `${config.almundo}?adults=1&date=2017-07-16,2017-07-26&from=BUE,${d}&to=${d},BUE`)
  const getFlights = urlsList
    .reduce((res, url) => {
      const each = new Promise(function(resolve, reject) {
        request(url, function (error, response, body) {
          if (error) return reject(error)
          return resolve(body)
        })
      })

      res.push(each)
      return res
    }, [])

  // Parse flights response for the format that my DB needs
  const flightsList = yield getFlights
  const parsedFlightsResponse = flightsList.map(flight => ({
    flight: getLowerPrices(JSON.parse(flight)),
    price: getLowerPrice(getLowerPrices(JSON.parse(flight))),
    timestamp: Date.now()
  }))

  // 2. Post flights to Firebase
  const flightsPost = parsedFlightsResponse
    .reduce((res, flight) => {
      const each = api({ method: 'post', path: 'flights', }, flight)

      res.push(each)
      return res
    }, [])

  const flightsPostResponse = yield flightsPost
  msg('--- Successfully saved flights response to firebase --- \n' + JSON.stringify(flightsPostResponse, null, 2))

  // 3. Get best historical price
  const bestPrice = yield api({ method: 'get', path: 'best'})
  msg('--- Successfully brought best historical price ---')

  for (let i = 0; i < flightsList.length; i++) {
    const flight = JSON.parse(flightsList[i])

    if (getLowerPrice(getLowerPrices(flight)) < bestPrice['-KgvWRGTI1jgRhXssfdi'].price) {
      yield api({ method: 'put', path: 'best/-KgvWRGTI1jgRhXssfdi', }, flight)

      twillio.sendSms('Ding ding ding! $' + getLowerPrice(getLowerPrices(flight)))
      msg('--- Ding ding ding! Found a best price and texted the user ---')
    } else {
      msg('--- No best price find in batch :( ---')
    }
  }
})

new CronJob.CronJob('*/15 * * * *', function() {
  console.log('--- Starting a new batch at ' + Date.now() + ' ---')
  getFlightsFromServices
}, null, true, 'America/Los_Angeles');
