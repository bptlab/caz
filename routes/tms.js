var express = require('express');
var router = express.Router();
var unicornAdapter = require('../unicorn/unicorn').unicornAdapter;

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