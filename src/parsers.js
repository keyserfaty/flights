export const getLowerPrices = response => response
  .results.matrixlowestPrice.data
  .map(item => {
    if (item.values.some(value => value.lowest_price)) {
      return Object.keys(item).reduce((res, key) => {
        if (key === 'values') {
          res.values = item.values.filter(value => value.lowest_price)
          return res
        }

        res[key] = item[key]
        return res
      }, {})
    }
  })
  .filter(item => item !== undefined)

export const getLowerPrice = response => response[0].values[0].value

export const buildFlightObject = arr => arr
  .map(flight => ({
    flight: getLowerPrices(JSON.parse(flight)),
    price: getLowerPrice(getLowerPrices(JSON.parse(flight))),
    timestamp: Date.now()
  }))
