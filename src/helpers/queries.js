import { cfg, user } from '../config'

const despegar = (from, to, date) => {
  const fromTo = (from + to).toUpperCase()
  const toFrom = (to + from).toUpperCase()

  return `${cfg.DESPEGAR}/ROUNDTRIP/
    ${from.toLowerCase()}/${to.toLowerCase()}/INTERNATIONAL/NA/prism_AR_0_FLIGHTS_A-1_C-0_I-0_RT-${fromTo}20170708-${toFrom}20170722
    _applyDynaprov-false_channel-site/2/PRECLUSTER/TOTALFARE/ASCENDING/1/NA/NA/ARS/ARS/NA/NA/NA/NA/NA/NA/NA/NA/NA/NA/NA/NA/NA?hashForData=jT3qPEg%2FMXVOrE5zYaJCWHwmJA4UnEPcEHD8Hx3qCYVuhVVb5STh%2FGVSM%2BJdJLym0OksX0gcoCPSlxEGYiUsIA%3D%3D`
}

const alMundo = (from, to, date) =>
  `${cfg.ALMUNDO}?adults=1&date=2017-07-16,2017-07-26&from=${from.toUpperCase()},${to.toUpperCase()}&to=${to.toUpperCase()},${from.toUpperCase()}`

const services = {
  despegar,
  alMundo,
}

/**
 * Returns a list of URLs for all available services
 * @param from
 * @param to
 * @param date
 * @returns {Array}
 */
const list = () => {
  return user.dest.map(to =>
    Object.keys(services).map(service => services[service](user.from, to, ''))
  )
}

export {
  list,
}
