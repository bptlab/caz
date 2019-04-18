var express = require('express');
var router = express.Router();
var helpers = require('../helpers');
var epcisEvents = require('../helpers/epcis-events');

router.post('/arrived-at-depot', function (req, res, next) {
  const { sscc, depotID } = req.body;
  const eventXml = epcisEvents.receiving(sscc, depotID);
  epcisEvents.send(eventXml);
  res.json({ message: "Event received." });
});

router.post('/pickup-reported', function (req, res, next) {
  const { sscc, depotID, receiverID } = req.body;
  const eventXml = epcisEvents.shipping(sscc, depotID, receiverID);
  epcisEvents.send(eventXml);
  res.json({ message: "Event received." });
});

router.post('/delivery-reported', function (req, res, next) {
  const { sscc, receiverID } = req.body;
  const eventXml = epcisEvents.receiving2(sscc, receiverID);
  epcisEvents.send(eventXml);
  res.json({ message: "Event received." });
});

/* POST new sis event list */
router.post('/parcels', function (req, res, next) {
  let payload = req.body;
  if (payload.indexOf("epcisq:EPCISQueryDocument") < 0) {
    // if it's not a SIS event
    helpers.sendEventToUnicorn(payload)
      .then(result => res.json(result))
      .catch(error => res.status(500).json({ status: 'failed 😢', error: error }));
  } else {
    // match ObjectEvents
    let match, objectEventRegExp = /(<ObjectEvent>[\s\S]*?<\/ObjectEvent>)/g;
    let $results = [];
    // send every ObjectEvent match to Unicorn
    while ((match = objectEventRegExp.exec(payload)) !== null) {
      const objectEvent = match[0];
      const queryDocument = helpers.getEPCISQueryDocumentForObjectEvent(objectEvent);
      $results.push(helpers.sendEventToUnicorn(queryDocument));
    }
    // Send response
    Promise.all($results)
      .then(results => res.json({ status: 'success' }))
      .catch(error => res.status(500).json({ status: 'failed 😢', error: error }));
  }
});

module.exports = router;
