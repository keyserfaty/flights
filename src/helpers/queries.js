import { cfg, user } from '../config'

const despegar = (from, to, fromDate, toDate) => {
  const fromTo = (from + to).toUpperCase()
  const toFrom = (to + from).toUpperCase()

  return `${cfg.DESPEGAR}/ROUNDTRIP/${from.toLowerCase()}/${to.toLowerCase()}/INTERNATIONAL/NA/prism_AR_0_FLIGHTS_A-1_C-0_I-0_RT-${fromTo}${fromDate.split('-').join('')}-${toFrom}${toDate.split('-').join('')}_applyDynaprov-false_channel-site/2/PRECLUSTER/TOTALFARE/ASCENDING/1/NA/NA/ARS/ARS/NA/NA/NA/NA/NA/NA/NA/NA/NA/NA/NA/NA/NA?hashForData=jT3qPEg%2FMXVOrE5zYaJCWHwmJA4UnEPcEHD8Hx3qCYVuhVVb5STh%2FGVSM%2BJdJLym0OksX0gcoCPSlxEGYiUsIA%3D%3D`
}

const alMundo = (from, to, fromDate, toDate) => {
  const fromTo = `${from.toUpperCase()},${to.toUpperCase()}`
  const toFrom = `${to.toUpperCase()},${from.toUpperCase()}`

  return `${cfg.ALMUNDO}?adults=1&date=${fromDate},${toDate}&from=${fromTo}&to=${toFrom}`
}

const services = {
  //despegar,
  alMundo,
}

/**
 * Returns a list of URLs for all available services
 * @param from
 * @param to
 * @param date
 * @returns {Array}
 */
const list = user.dest
  .map(to => Object.keys(services)
    .reduce((res, service) => {
      const each = {
        url: services[service](user.from, to, user.fromDate, user.toDate),
        company: service.toUpperCase(),
      }

      res.push(each)
      return res
    }, [])
  )
  .reduce((prev, curr) =>
    prev.concat(curr)
  )

export {
  list,
}
