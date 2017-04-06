import request from 'request'
import api from './services/api'

export const buildRequestArray = arr => arr
.reduce((res, url) => {
  const each = new Promise(function (resolve, reject) {
    request(url, function (error, response, body) {
      if (error) return reject(error)
      return resolve(body)
    })
  })

  res.push(each)
  return res
}, [])

export const buildFlightPostArray = arr => arr
.reduce((res, flight) => {
  const each = api({ method: 'post', path: 'flights' }, flight)

  res.push(each)
  return res
}, [])

export const fail = msg => console.log(msg)
export const msg = msg => console.log(msg)
