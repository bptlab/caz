const pickshare = require('./handlers/pickshare');
const sis = require('./handlers/sis');

const SUBSCRIPTIONS = [
  { event: { eventName: 'DCParcel', attributes: ['*'], filters: { 'DO_state': 'ready' } }, handler: sis.reportArrivalAtDepot },
  { event: { eventName: 'DCParcel', attributes: ['*'], filters: { 'DO_state': 'on the way' } }, handler: sis.reportPickup },
  { event: { eventName: 'DCParcel', attributes: ['*'], filters: { 'DO_state': 'delivered' } }, handler: sis.reportDelivery },
  { event: { eventName: 'DCParcel', attributes: ['*'], filters: { 'DO_state': 'registered' } }, handler: pickshare.registerParcel },
  { event: { eventName: 'DCTimeSlotOffer', attributes: ['*'], filters: { 'DO_state': 'created' } }, handler: pickshare.createOffer },
  { event: { eventName: 'DCParcel', attributes: ['*'], filters: { 'DO_state': 'delivered' } }, handler: pickshare.reportDelivery }
];

module.exports = SUBSCRIPTIONS;