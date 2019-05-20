var express = require('express');
var router = express.Router();
var helpers = require('../helpers');
var unicornAdapter = require('../unicorn/unicorn').unicornAdapter;
var pickshareEvents = require('../helpers/pickshare-events');

/* UNICORN subscriptions */
router.post('/parcel-registered', function (req, res, next) {
  const parcel = req.body;
  pickshareEvents.registerParcel(parcel)
    .then(receiver => receiverPreferencesReceived(parcel, receiver))
    .catch(error => console.error(error));
  next();
}, helpers.sendSuccessfullUnicornResponse);

router.post('/time-slot-offer-created', function (req, res, next) {
  const timeSlotOffer = req.body;
  pickshareEvents.createOffer(timeSlotOffer)
    .then(result => console.log(result))
    .catch(error => console.error(error));
  next();
}, helpers.sendSuccessfullUnicornResponse);

router.post('/delivery-reported', function (req, res, next) {
  const parcel = req.body;
  pickshareEvents.confirmDelivery(parcel.sscc)
    .then(result => console.log(result))
    .catch(error => console.error(error));
  next();
}, helpers.sendSuccessfullUnicornResponse);

/* Incoming Events */
/* Receiver Preferences Received */
const receiverPreferencesReceived = (parcel, pickshareEvent) => {
  const unicornEvent = helpers.unicornEvents.ETReceiverPreferencesReceived(parcel, pickshareEvent);
  return unicornAdapter.generateChimeraEvent(unicornEvent, 'ETReceiverPreferencesReceived');
};

router.post('/receiver-preferences-received', function (req, res, next) {
  const event = req.body;
  unicornAdapter.generateChimeraEvent(event, 'ETReceiverPreferencesReceived')
    .then(response => res.send(response));
});

/* Parcel arrived at depot */
router.post('/arrived-at-depot', function (req, res, next) {
  const event = req.body;
  unicornAdapter.generateChimeraEvent(event, 'ETArrivedAtDepot', 'received')
    .then(response => res.send(response));
});

/* Time Slot Offer confirmed by customer */
router.post('/offer-confirmed', function (req, res, next) {
  const event = req.body;
  unicornAdapter.generateChimeraEvent(event, 'ETTimeSlotOfferConfirmed')
    .then(response => res.send(response));
});

module.exports = router;