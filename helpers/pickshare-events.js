const request = require('request-promise');

const PICKSHARE_BASE_URL = 'https://pickshare-preprod.herokuapp.com';
const PICKSHARE_API_URL = `${ PICKSHARE_BASE_URL }/smile/v1`;
const PICKSHARE_BEARER_TOKEN = 'ZuLdunfzRDTNCtc2cxsjFkvvyujFYphiwHGIwv2BDJ8MbUyt8mz5NX9fFwYTVvTabPQqLFbL4zfdXLdKxBph8RJLTAaRpdTRZcXYQaFf3jE3mZNohjnu9Ny3CyMKi3yy';

const registerParcel = function (parcel) {
  const payload = {
    "receiverLastName": parcel.receiverLastName,
    "depotStreetNumber": parcel.depotStreetNumber,
    "depotCity": parcel.depotCity,
    "senderZIP": parcel.senderZIP,
    "depotCountry": parcel.depotCountry,
    "senderStreetName": parcel.senderStreetName,
    "initialSendDate": parcel.initialSendDate,
    "senderOrganization": parcel.senderOrganisation,
    "bizStep": parcel.bizStep,
    "dateOfPlannedDelivery": parcel.dateOfPlannedDelivery,
    "receiverFirstName": parcel.receiverFirstName,
    "senderCountry": parcel.senderCountry,
    "senderLastName": parcel.senderLastName,
    "senderOrganizationGLN": parcel.senderOrganisationGLN,
    "senderStreetNumber": parcel.senderStreetNumber,
    "height": parcel.height,
    "depotName": parcel.depotName,
    "senderFirstName": parcel.senderFirstName,
    "length": parcel.length,
    "senderCity": parcel.senderCity,
    "grossWeight": parcel.grossWeight,
    "receiverID": parcel.receiverID,
    "depotZIP": parcel.depotCity,
    "sscc": parcel.sscc,
    "width": parcel.width,
    "depotStreetName": parcel.depotStreetName
  };
  const url = `${ PICKSHARE_API_URL }/parcel`;
  return send(url, payload);
};

const createOffer = function (offer) {
  const payload = {
    "timeSlotBegin": offer.timeSlotBegin,
    "timeSlotEnd": offer.timeSlotEnd,
    "price": offer.price,
    "cutOffTime": offer.cutOffTime,
    "sscc": offer.sscc
  };
  const url = `${ PICKSHARE_API_URL }/offers`;
  return send(url, payload);
};

const confirmDelivery = function (sscc) {
  const url = `${ PICKSHARE_API_URL }/parcels/confirm/${ sscc }`;
  return request.get(url, { 'bearer': PICKSHARE_BEARER_TOKEN });
};

const send = function (url, payload) {
  return request.post(url, {
    json: payload,
    auth: { 'Bearer': PICKSHARE_BEARER_TOKEN }
  })
    .then(result => console.log(result))
    .catch(error => console.log(error));
};

module.exports = {
  registerParcel,
  createOffer,
  confirmDelivery
};