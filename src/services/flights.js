import co from 'co'
import twillio from '../services/twillio'

import api from '../helpers/api'
import { buildRequestArray, buildFlightPostArray } from '../helpers/flights'
import { utils } from '../helpers/parsers'
import { msg } from '../helpers/utils'

/**
 * Get a list of flights from an external provider
 * Receives an array because you may want to get a list of options
 * for different destinations within the same time range and service
 * @param urls
 */
const getFlights = services => co(function * () {
  const response = yield buildRequestArray(services)
  msg('--- Successfully got flights from urls ---')
  return response[0]
})

/**
 * Post a list of flights to out firebase service.
 * Before doing it, it parses the answer to match out DB's structure.
 * @param company
 * @param flights
 */
const postFlights = (company, flights) => co(function * () {
  const response = yield buildFlightPostArray(utils.buildFlights(company, flights))
  msg('--- Successfully saved flights response to firebase --- \n' + JSON.stringify(response, null, 2))
  return response
})

/**
 * Get best historical price from firebase
 */
const getBestPrice = () => co(function * () {
  const response = yield api({ method: 'GET', path: 'best' })
  msg('--- Successfully brought best historical price ---')
  return response
})

const postBestPrice = flight => co(function * () {
  const response = yield api({method: 'PUT', path: 'best/-KgvWRGTI1jgRhXssfdi'}, flight)
  msg('--- Just posted a new best price to firebase! ---')
  return response
})

const alertBestPrice = flight => {
  twillio.sendSms('Ding ding ding! $' + flight.price)
  msg('--- Ding ding ding! Found a best price and texted the user ---')
}

export {
  getFlights,
  postFlights,
  getBestPrice,
  postBestPrice,
  alertBestPrice,
}
