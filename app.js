var request = require('request');
var twillio = require('./twillio')

const URL = 'https://almundo.com.ar/flights/async/itineraries'
const dest = ['PAR', 'MAD', 'LON', 'BRU']
const query = dest.map(d => `${URL}?adults=1&date=2017-07-16,2017-07-26&from=BUE,${d}&to=${d},BUE`)

const getBestPrice = () => {
  return new Promise((resolve, reject) => {
    request.get({
      url:'https://flights-d62e5.firebaseio.com/best.json',
      json: true,
      headers: {
        "content-type": "application/json",
      },
    }, function(err, httpResponse, body){
      if (err) {
        return reject(body)
      }

      return resolve(body)
    })
  })
}

const postToFirebase = (opt, obj) => {
  request({
    method: opt.method,
    url:'https://flights-d62e5.firebaseio.com/' + opt.path + '.json',
    json: true,
    headers: {
      "content-type": "application/json",
    },
    body: obj
  }, function(err, httpResponse, body){
    console.log(body)
  })
}

const getLowerPrices = response => response
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

const getLowerPrice = response => response[0].values[0].value

const getFlightsFromService = query => {
  getBestPrice()
  .then(bestPrice => {
    query.map(url => {
      request(url, function (error, response, body) {
        const res = JSON.parse(body)

        postToFirebase({
          method: 'post',
          path: 'flights',
        }, {
          flight: getLowerPrices(res),
          query: url,
          price: getLowerPrice(getLowerPrices(res)),
          timestamp: Date.now()
        })

        if (getLowerPrice(getLowerPrices(res)) < bestPrice['-KgvWRGTI1jgRhXssfdi'].price) {
          postToFirebase({
            method: 'put',
            path: 'best/-KgvWRGTI1jgRhXssfdi',
          }, {
            flight: getLowerPrices(res),
            query: url,
            price: getLowerPrice(getLowerPrices(res)),
            timestamp: Date.now()
          })

          twillio.sendSms('Ding ding ding! $' + getLowerPrice(getLowerPrices(res)))
        }
      });
    })
  })
}

getFlightsFromService(query)