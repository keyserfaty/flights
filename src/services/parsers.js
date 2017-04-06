const despegar = {}

despegar.buildFlights = d => d
.result.data.items
.reduce((res, item) => {
  const it = item.itinerariesBox.matchingInfoMap._0_0.itineraryTrackingInfo
  const each = {
    price: item.emissionPrice.adult.total.amount,
    flight: item,
    company: 'DESPEGAR',
    query: `https://www.despegar.com.ar/shop/flights/results/${it.searchType.toLowerCase()}/${it.departureCity.code}/${it.arrivalCity.code}/${it.departureDate.raw}/${it.arrivalDate.raw}/1/0/0?from=SB`,
    timestamp: Date.now(),
  }

  res.push(each)
  return res
}, [])

const alMundo = {}

alMundo.buildFlights = d => d
.results.clusters
.reduce((res, item) => {
  const each = {
    price: item.price.total,
    flight: item,
    company: 'ALMUNDO',
    query: `https://almundo.com.ar/flights/results?from=${d.query.from}&to=${d.query.to}&date=${d.query.date}&adults=1`,
    timestamp: Date.now(),
  }

  res.push(each)
  return res
}, [])

export {
  despegar,
  alMundo,
}
