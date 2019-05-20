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
    "senderOrganisation": senderOrganisation,
    "depotCountry": depotCountry,
    "senderOrganisationGLN": senderGLN,
    "senderCity": senderCity,
    "bizStep": bizStep,
    "senderStreetName": senderStreetName,
    "depotName": depotOrganisation,
    "grossWeight": grossWeightValue,
    "senderLastName": senderLastname,
    "senderCountry": senderCountry
  };
};

const ETReceiverPreferencesReceived = (parcel, pickshareEvent) => {
  const {
    receiverStreet,
    receiverCity,
    receiverZIP,
    receiverCountry,
    receiverFirstName,
    receiverLastName,
    receiverOrganisation,
    receiverLevel,
    receiverRemark,
    typeOfDelivery,
    pickshareDeliveryPreferences
  } = pickshareEvent;

  // Create Time Slots
  const timeSlotBegin = new Date(parcel.dateOfPlannedDelivery);
  const timeSlotEnd = new Date(parcel.dateOfPlannedDelivery);

  // Get american weekday index of date of planned delivery and convert to german index
  const arrivalDay = (timeSlotBegin.getDay() - 1) % 7;

  // Find window that fits day. Choose later if multiple windows match.
  const deliveryWindow = pickshareDeliveryPreferences
  // Sort
    .sort((a, b) =>  !(a['timeTo'] < b['timeTo']))
    // Pick day
    .find(window =>  window['days'][arrivalDay] === '1');


  // Get hours and minutes;
  // Note: timeTo and timeFrom need to be switched 🤨
  const [startHour, startMinute] = deliveryWindow['timeTo'].split(':');
  const [endHour, endMinute] = deliveryWindow['timeFrom'].split(':');

  // update dates
  timeSlotBegin.setHours(parseInt(startHour), parseInt(startMinute));
  timeSlotEnd.setHours(parseInt(endHour), parseInt(endMinute));

  const [receiverStreetName, receiverStreetNumber] = receiverStreet.split(' ');

  return {
    receiverID: parcel.receiverID,
    receiverStreetName: receiverStreetName || '',
    receiverStreetNumber: receiverStreetNumber || '',
    receiverZIP: receiverZIP || '',
    receiverCity: receiverCity || '',
    receiverCountry: receiverCountry || '',
    typeOfDelivery: typeOfDelivery || '',
    timeSlotBegin: timeSlotBegin || '',
    timeSlotEnd: timeSlotEnd || '',
    receiverFirstName: receiverFirstName || '',
    receiverLastName: receiverLastName || '',
    receiverOrganisation: receiverOrganisation || '',
    receiverLevel: receiverLevel || '',
    receiverRemark: receiverRemark || ''
  };
};

module.exports = {
  ETParcelDataCreated,
  ETReceiverPreferencesReceived
};