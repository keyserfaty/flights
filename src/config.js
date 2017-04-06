const cfg = {
  firebase: 'https://flights-d62e5.firebaseio.com/',
  almundo: 'https://almundo.com.ar/flights/async/itineraries',
  port: process.env.PORT || 3000,
  secret: process.env.APP_SECRET || 'keyboard cat',
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  sendingNumber: process.env.TWILIO_NUMBER,
}

// TODO: shouldn't be hardcoded in future versions of the app
const user = {
  name: 'Karen',
  phone: '+541136266811',
  dest: ['PAR', 'MAD', 'LON', 'BRU'],
}

var requiredConfig = [cfg.accountSid, cfg.authToken, cfg.sendingNumber]
var isConfigured = requiredConfig.every(function (configValue) {
  return configValue || false
})

if (!isConfigured) {
  var errorMessage =
    'TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_NUMBER must be set.'

  throw new Error(errorMessage)
}

export {
  cfg,
  user,
}
