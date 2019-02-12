const request = require('request-promise');

const UNICORN_BASE_URL = process.env.UNICORN_BASE_URL || "http://unicorn:8080/unicorn";
const CAZ_BASE_URL = process.env.CAZ_BASE_URL || "http://caz:3000";

const UNICORN_NOTIFICATION_URL = `${ UNICORN_BASE_URL }/webapi/REST/EventQuery/REST`;
const CAZ_CALLBACK_URL = `${ CAZ_BASE_URL }/notification`;

class UnicornController {
  constructor() {
    this.tries = 5;
    this.parcelNotificationUUID = "";
    this.timeSlotOfferNotificationUUID = "";
  }

  subscribeToEvents() {
    return Promise.all([
      this.subscribeToDCParcel(),
      this.subscribeToDCTimeSlotOffer()
    ]).then(([parcelResponse, timeSlotOfferResponse]) => {
      console.info(parcelResponse);
      this.parcelNotificationUUID = parcelResponse;

      console.info(timeSlotOfferResponse);
      this.timeSlotOfferNotificationUUID = timeSlotOfferResponse;

      return [parcelResponse, timeSlotOfferResponse];
    }).catch(error => {
      if (this.tries > 0) this.tries -= 1;
      else return;

      return setTimeout(() => {
        console.log("Trying to connect...");
        return this.subscribeToEvents();
      }, 5000)
    });
  }

  unsubscribeEvents() {
    return Promise.all([
      this.unsubscribeDCParcel(),
      this.unsubscribeDCTimeSlotOffer()
    ]).then(() => {
      console.info("Deleted Notification");
    }).catch(error => {
      console.log(error.message);
    });
  }

  unsubscribeDCParcel() {
    return UnicornController.unsubscribeEvent(this.parcelNotificationUUID);
  }

  subscribeToDCParcel() {
    return UnicornController.subscribeToEvent('DCParcel');
  }

  unsubscribeDCTimeSlotOffer() {
    return UnicornController.unsubscribeEvent(this.timeSlotOfferNotificationUUID);
  }

  subscribeToDCTimeSlotOffer() {
    return UnicornController.subscribeToEvent('DCTimeSlotOffer');
  }

  static unsubscribeEvent(uuid) {
    return UnicornController.deleteUnicornNotificationRule(uuid);
  }

  static subscribeToEvent(eventName, attributes = ["*"]) {
    const attributesString = attributes.join(", ");
    const esperQuery = `SELECT ${ attributesString } FROM ${ eventName }`;
    return UnicornController.createUnicornNotificationRule(esperQuery);
  }

  static createUnicornNotificationRule(queryString) {
    console.info(`Sending query: "${ queryString }" to "${ UNICORN_NOTIFICATION_URL }" with callback url: "${ CAZ_CALLBACK_URL }"`);

    const body = {
      notificationPath: CAZ_CALLBACK_URL,
      queryString
    };

    return request({
      uri: UNICORN_NOTIFICATION_URL,
      method: 'POST',
      headers: UnicornController.unicornAPIHeaders,
      json: true,
      body
    });
  }

  static deleteUnicornNotificationRule(uuid) {
    console.info(`Deleting notification with uuid: ${ uuid }`);

    return request({
      uri: `${ UNICORN_NOTIFICATION_URL }/${ uuid }`,
      method: 'DELETE'
    })
  }

  static get unicornAPIHeaders() {
    return {
      'Content-Type': 'application/json',
      'Accept': 'text/plain'
    }
  }
}

module.exports = UnicornController;
