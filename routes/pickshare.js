var express = require('express');
var router = express.Router();
var unicornAdapter = require('../unicorn/unicorn').unicornAdapter;

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