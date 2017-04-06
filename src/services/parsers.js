const despegar = d => d
  .result.data.items
  .reduce((res, item) => {
    const it = item.itinerariesBox.matchingInfoMap._0_0.itineraryTrackingInfo
    const each = {
      price: item.emissionPrice.adult.total.amount,
      flight: item,
      company: 'DESPEGAR',
      query: `https://www.despegar.com.ar/shop/flights/results/${it.searchType.toLowerCase()}/${it.departureCity.code}/${it.arrivalCity.code}/${it.departureDate.raw}/${it.arrivalDate.raw}/1/0/0?from=SB`
    }

    res.push(each)
    return res
  }, [])

export {
  despegar,
}
