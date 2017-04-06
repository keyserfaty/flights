var config = require('./../config');
var client = require('twilio')(config.accountSid, config.authToken);

module.exports.sendSms = function(message) {
  client.messages.create({
    body: message,
    to: config.user.phone,
    from: config.sendingNumber
  }, function(err, data) {
    if (err) {
      console.error('Could not notify administrator');
      console.error(err);
    } else {
      console.log('Message sent!');
    }
  });
};