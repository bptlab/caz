const UnicornAdapter = require('unicorn-adapter');

const UNICORN_BASE_URL = process.env.UNICORN_BASE_URL || "http://unicorn:8080/unicorn";
const CAZ_BASE_URL = process.env.CAZ_BASE_URL || "http://caz:3000";

const CAZ_CALLBACK_URL = `${ CAZ_BASE_URL }/notification`;

class UnicornController {
  constructor() {
    const options = {
      maxTries: 10
    };
    this.unicornAdapter = new UnicornAdapter(UNICORN_BASE_URL, CAZ_CALLBACK_URL, options);
    this.parcelNotificationUUID = "";
    this.timeSlotOfferNotificationUUID = "";
  }

  subscribeToEvents() {
    return Promise.all([
      this.subscribeToDCParcel(),
      this.subscribeToDCTimeSlotOffer()
    ]).then(([parcelResponse, timeSlotOfferResponse]) => {

      console.info(`DCParcel UUID: ${ parcelResponse }`);
      this.parcelNotificationUUID = parcelResponse;

      console.info(`DCTimeSlotOffer UUID: ${ timeSlotOfferResponse }`);
      this.timeSlotOfferNotificationUUID = timeSlotOfferResponse;

      return [parcelResponse, timeSlotOfferResponse];
    });
  }

  unsubscribeEvents() {
    return Promise.all([
      this.unsubscribeDCParcel(),
      this.unsubscribeDCTimeSlotOffer()
    ]).then(() => {
      console.info("Deleted Notification");
    });
  }

  unsubscribeDCParcel() {
    return this.unicornAdapter.unsubscribeFromEvent(this.parcelNotificationUUID);
  }

  subscribeToDCParcel() {
    return this.unicornAdapter.subscribeToEvent('DCParcel');
  }

  unsubscribeDCTimeSlotOffer() {
    return this.unicornAdapter.unsubscribeFromEvent(this.timeSlotOfferNotificationUUID);
  }

  subscribeToDCTimeSlotOffer() {
    return this.unicornAdapter.subscribeToEvent('DCTimeSlotOffer');
  }
}

module.exports = UnicornController;
