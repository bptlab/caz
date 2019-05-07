var request = require('request-promise');
var unicornEvents = require('./unicorn-events');
var epcisEvents = require('./epcis-events');
const UNICORN_BASE_URL = process.env.UNICORN_BASE_URL || "http://unicorn:8080/unicorn";

const sendEventToUnicorn = (event) => {
  return request({
    uri: `${UNICORN_BASE_URL}/webapi/REST/Event`,
    method: 'POST',
    headers: {'content-type': 'application/xml'},
    body: event
  });
};

const sendSuccessfullUnicornResponse = (req, res, next) => {
  res.json({ message: "Event received." });
};

module.exports = {
  sendEventToUnicorn,
  sendSuccessfullUnicornResponse,
  unicornEvents,
  epcisEvents
};