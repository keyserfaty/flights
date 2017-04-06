import co from 'co'
import { buildRequestArray, buildFlightPostArray, msg } from '../helpers'
import { buildFlightObject } from '../parsers'
import api from './api'

const getFlights = urls => co(function * () {
  const response = yield buildRequestArray(urls)
  msg('--- Successfully get flights from urls ---')
  return response
})

const postFlights = flights => co(function * () {
  const response = yield buildFlightPostArray(buildFlightObject(flights))
  msg('--- Successfully saved flights response to firebase --- \n' + JSON.stringify(response, null, 2))
  return response
})

const getBestPrice = () => co(function * () {
  const response = yield api({ method: 'GET', path: 'best' })
  msg('--- Successfully brought best historical price ---')
  return response
})

export {
  getFlights,
  postFlights,
  getBestPrice,
}
