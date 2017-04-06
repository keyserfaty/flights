import request from 'request'
import api from './api'
import { utils } from '../helpers/parsers'

export const buildRequestArray = services => services
.reduce((res, service) => {
  const each = new Promise(function (resolve, reject) {
    request(service.url, function (error, response, body) {
      if (error) return reject(error)
      return resolve(utils.buildFlights(service.company, JSON.parse(body)))
    })
  })

  res.push(each)
  return res
}, [])

export const buildFlightPostArray = arr => arr
.reduce((res, flight) => {
  const each = api({ method: 'POST', path: 'flights' }, flight)

  res.push(each)
  return res
}, [])
