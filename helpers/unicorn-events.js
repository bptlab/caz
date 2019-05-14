const ETParcelDataCreated = (sisEvent) => {
  const {
    eventTime,
    eventTimeZoneOffset,
    epcList: { epc },
    action,
    bizStep,
    disposition,
    readPoint: { id: readPointId } = { },
    bizLocation: { id: bizLocationId } = { },
    extension: {
      ilmd: {
        'smile:sender': {
          'smile:city': senderCity,
          'smile:country': senderCountry,
          'smile:firstName': senderFirstname,
          'smile:lastName': senderLastname,
          'smile:gln': senderGLN,
          'smile:streetName': senderStreetName,
          'smile:streetNumber': senderStreetNumber,
          'smile:zip': senderZip,
          'smile:organisation': senderOrganisation
        } = { },
        'smile:depot': {
          'smile:city': depotCity,
          'smile:country': depotCountry,
          'smile:organisation': depotOrganisation,
          'smile:streetName': depotStreetName,
          'smile:streetNumber': depotStreetNumber,
          'smile:zip': depotZip
        } = { },
        'smile:receiver': {
          'smile:firstName': receiverFirstname,
          'smile:lastName': receiverLastname,
          'smile:smileUserId': receiverSmileUserId
        } = { },
        'smile:item': {
          'smile:grossWeight': {
            'smile:uom': grossWeightUOM,
            'smile:value': grossWeightValue
          } = { },
          'smile:height': {
            'smile:uom': heightUOM,
            'smile:value': heightValue
          } = { },
          'smile:width': {
            'smile:uom': widthUOM,
            'smile:value': widthValue
          } = { },
          'smile:length': {
            'smile:uom': lengthUOM,
            'smile:value': lengthValue
          }
        } = { },
        'smile:dateOfPlannedDelivery': {
          _: dateOfPlannedDelivery
        } = { },
        'smile:carrierItemId': {
          _: carrierItemId
        } = { }
      }
    }
  } = sisEvent.ObjectEvent;
  return {
    "initialSendDate": eventTime,
    "length": lengthValue,
    "dateOfPlannedDelivery": dateOfPlannedDelivery,
    "depotZIP": depotZip,
    "receiverLastName": receiverLastname,
    "receiverID": receiverSmileUserId,
    "depotID": "",
    "height": heightValue,
    "senderStreetNumber": senderStreetNumber,
    "senderFirstName": senderFirstname,
    "senderZIP": senderZip,
    "depotCity": depotCity,
    "depotStreetNumber": depotStreetNumber,
    "width": widthValue,
    "receiverFirstName": receiverFirstname,
    "depotStreetName": depotStreetName,
    "sscc": epc,
    "senderOrganization": senderOrganisation,
    "depotCountry": depotCountry,
    "senderOrganizationGLN": senderGLN,
    "senderCity": senderCity,
    "bizStep": bizStep,
    "senderStreetName": senderStreetName,
    "depotName": depotOrganisation,
    "grossWeight": grossWeightValue,
    "senderLastName": senderLastname,
    "senderCountry": senderCountry
  };
};

module.exports = {
  ETParcelDataCreated
};