const epcisEvents = require('../../helpers/epcis-events');

function reportArrivalAtDepot(event, next) {
  let { sscc, depotID, depotOrganisation, depotFirstname, depotLastname } = event;
  // If depot id is empty use available name
  depotID = depotID === 'ERROR' ? undefined : depotID;
  depotID = depotID || depotOrganisation || depotFirstname + depotLastname;
  const eventXml = epcisEvents.receiving(sscc, depotID);
  epcisEvents.send(eventXml);
  next();
}

function reportPickup(event, next) {
  const { sscc, receiverID } = event;
  const eventXml = epcisEvents.receiving2(sscc, receiverID);
  epcisEvents.send(eventXml);
  next();
}

function reportDelivery(event, next) {
  const { sscc, receiverID } = event;
  const eventXml = epcisEvents.receiving2(sscc, receiverID);
  epcisEvents.send(eventXml);
  next();
}

module.exports = {
  reportArrivalAtDepot,
  reportPickup,
  reportDelivery
};