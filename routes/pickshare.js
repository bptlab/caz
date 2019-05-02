var express = require('express');
var router = express.Router();
var helpers = require('../helpers');
var unicornAdapter = require('../unicorn/unicorn').unicornAdapter;

/* UNICORN subscriptions */
router.post('/parcel-registered', function (req, res, next) {
  const parcel = req.body;
  console.log("Sending Parcel Data to PickShare");
  console.log(parcel);
  next();
}, helpers.sendSuccessfullUnicornResponse);

router.post('/time-slot-offer-created', function (req, res, next) {
  const timeSlotOffer = req.body;
  console.log("Sending Time Slot Offer to PickShare");
  console.log(timeSlotOffer);
  next();
}, helpers.sendSuccessfullUnicornResponse);

/* Receiver preferences */
router.post('/receiver-preferences-received', function (req, res, next) {
  const event = req.body;
  unicornAdapter.generateChimeraEvent(event, 'DCReceiverPreferences', 'received')
    .then(response => res.send(response));
});

/* Parcel arrived at depot */
router.post('/arrived-at-depot', function (req, res, next) {
  const event = req.body;
  unicornAdapter.generateChimeraEvent(event, 'DCArrivedAtDepot', 'received')
    .then(response => res.send(response));
});

/* Time Slot Offer confirmed by customer */
router.post('/offer-confirmed', function (req, res, next) {
  const event = req.body;
  unicornAdapter.generateChimeraEvent(event, 'ETTimeSlotOfferConfirmed')
    .then(response => res.send(response));
});

/* Parcel picked up at micro depot */
router.post('/pick-up-reported', function (req, res, next) {
  const event = req.body;
  unicornAdapter.generateChimeraEvent(event, 'ETPickUpReported')
    .then(response => res.send(response));
});

/* Parcel delivered to customer */
router.post('/delivery-reported', function (req, res, next) {
  const event = req.body;
  unicornAdapter.generateChimeraEvent(event, 'ETDeliveryReported')
    .then(response => res.send(response));
});

module.exports = router;