const pickshareEvents = require('../../helpers/pickshare-events');
const helpers = require('../../helpers');
const unicornAdapter = require('../../unicorn/unicorn').unicornAdapter;

function registerParcel(parcel, next) {
  pickshareEvents.registerParcel(parcel)
    .then(receiver => receiverPreferencesReceived(parcel, receiver))
    .catch(error => console.error(error));
  next();
}

function createOffer(timeSlotOffer, next) {
  pickshareEvents.createOffer(timeSlotOffer)
    .then(result => console.log(result))
    .catch(error => console.error(error));
  next();
}

function reportDelivery(parcel, next) {
  pickshareEvents.confirmDelivery(parcel.sscc)
    .then(result => console.log(result))
    .catch(error => console.error(error));
  next();
}

/* Receiver Preferences Received */
const receiverPreferencesReceived = (parcel, pickshareEvent) => {
  const unicornEvent = helpers.unicornEvents.ETReceiverPreferencesReceived(parcel, pickshareEvent);
  return unicornAdapter.generateChimeraEvent(unicornEvent, 'ETReceiverPreferencesReceived');
};

module.exports = {
  registerParcel,
  createOffer,
  reportDelivery
};
