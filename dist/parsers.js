'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var getLowerPrices = exports.getLowerPrices = function getLowerPrices(response) {
  return response.results.matrixlowestPrice.data.map(function (item) {
    if (item.values.some(function (value) {
      return value.lowest_price;
    })) {
      return Object.keys(item).reduce(function (res, key) {
        if (key === 'values') {
          res.values = item.values.filter(function (value) {
            return value.lowest_price;
          });
          return res;
        }

        res[key] = item[key];
        return res;
      }, {});
    }
  }).filter(function (item) {
    return item !== undefined;
  });
};

var getLowerPrice = exports.getLowerPrice = function getLowerPrice(response) {
  return response[0].values[0].value;
};