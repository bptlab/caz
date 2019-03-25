var express = require('express');
var router = express.Router();
var helpers = require('../helpers');

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
