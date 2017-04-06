var cfg = {}

cfg.user = {
  name: 'Karen',
  phone: '+541136266811'
}

// Firebase API
cfg.firebase = 'https://flights-d62e5.firebaseio.com/'

// Almundo API
cfg.almundo = 'https://almundo.com.ar/flights/async/itineraries'

// Destinations
cfg.dest = ['PAR', 'MAD', 'LON', 'BRU']

// HTTP Port to run our web application
cfg.port = process.env.PORT || 3000

cfg.secret = process.env.APP_SECRET || 'keyboard cat'

// Twilio
cfg.accountSid = process.env.TWILIO_ACCOUNT_SID
cfg.authToken = process.env.TWILIO_AUTH_TOKEN
cfg.sendingNumber = process.env.TWILIO_NUMBER

var requiredConfig = [cfg.accountSid, cfg.authToken, cfg.sendingNumber]
var isConfigured = requiredConfig.every(function(configValue) {
  return configValue || false
})

if (!isConfigured) {
  var errorMessage =
    'TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_NUMBER must be set.'

  throw new Error(errorMessage)
}

// Export configuration object
module.exports = cfg

