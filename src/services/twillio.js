import { cfg, user } from '../config'
const client = require('twilio')(cfg.accountSid, cfg.authToken)

module.exports.sendSms = function (message) {
  client.messages.create({
    body: message,
    to: user.phone,
    from: cfg.sendingNumber,
  }, function (err, data) {
    if (err) {
      console.error('Could not notify administrator')
      console.error(err)
    } else {
      console.log('Message sent!')
    }
  })
}
