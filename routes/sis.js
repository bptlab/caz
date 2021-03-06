var express = require('express');
var router = express.Router();
var helpers = require('../helpers');
var epcisEvents = require('../helpers/epcis-events');
var parseXmlString = require('xml2js').parseString;
var unicornAdapter = require('../unicorn/unicorn').unicornAdapter;

/* UNICORN subscriptions */

router.post('/arrived-at-depot', function (req, res, next) {
  let { sscc, depotID, depotOrganisation, depotFirstname, depotLastname } = req.body;
  // If depot id is empty use available name
  depotID = depotID === 'ERROR' ? undefined : depotID;
  depotID = depotID || depotOrganisation || depotFirstname + depotLastname;
  const eventXml = epcisEvents.receiving(sscc, depotID);
  epcisEvents.send(eventXml);
  next();
}, helpers.sendSuccessfullUnicornResponse);

router.post('/pickup-reported', function (req, res, next) {
  let { sscc, depotID, receiverID, depotOrganisation, depotFirstname, depotLastname } = req.body;
  // If depot id is empty use available name
  depotID = depotID === 'ERROR' ? undefined : depotID;
  depotID = depotID || depotOrganisation || depotFirstname + depotLastname;
  const eventXml = epcisEvents.shipping(sscc, depotID, receiverID);
  epcisEvents.send(eventXml);
  next();
}, helpers.sendSuccessfullUnicornResponse);

router.post('/delivery-reported', function (req, res, next) {
  const { sscc, receiverID } = req.body;
  const eventXml = epcisEvents.receiving2(sscc, receiverID);
  epcisEvents.send(eventXml);
  next();
}, helpers.sendSuccessfullUnicornResponse);

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
    while ((match = objectEventRegExp.exec(payload)) !== null) {
      const objectEventXml = match[0];
      // try parsing object events
      const $objectEvent = new Promise(((resolve, reject) => {
        parseXmlString(objectEventXml, {explicitArray : false}, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      }));
      const $result = $objectEvent.then(result => {
        const bizStepName = result.ObjectEvent.bizStep;
        switch (bizStepName) {
          // Creation of parcel data
          case 'urn:epcglobal:cbv:bizstep:commissioning':
            // convert SIS event to ETParcelDataCreated
            const unicornEvent = helpers.unicornEvents.ETParcelDataCreated(result);
            return unicornAdapter.generateChimeraEvent(unicornEvent, 'ETParcelDataReceived', 'new');
          // Parcel arrives at depot or at the receiver
          case 'urn:epcglobal:cbv:bizstep:receiving':
          // Parcel is picked up at depot
          case 'urn:epcglobal:cbv:bizstep:shipping':
          // Unknown bizStep
          default:
            break;
        }
      });
      $results.push($result);
    }
    // Send response
    Promise.all($results)
      .then(results => {
        console.info('Imported events: ' + results.join(", "));
        res.json({ status: 'success', results });
      })
      .catch(error => {
        console.error('Failed to import events:\n' + error);
        console.log(payload);
        res.status(200).json({ status: 'failed 😢', error });
      });
  }
});

module.exports = router;
