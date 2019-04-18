const UnicornAdapter = require('unicorn-adapter');

const UNICORN_BASE_URL = process.env.UNICORN_BASE_URL || "http://unicorn:8080/unicorn";
const CAZ_BASE_URL = process.env.CAZ_BASE_URL || "http://caz:3000";

const CAZ_CALLBACK_URL = `${ CAZ_BASE_URL }/notification`;

class UnicornController {
  constructor() {
    const options = { maxTries: 10 };
    this.unicornAdapter = new UnicornAdapter(UNICORN_BASE_URL, CAZ_CALLBACK_URL, options);
    this.notificationRuleUUIDs = [];
    this.subscriptionsToExecute = [
      () => this.subscribeToEvent('DCParcel', ['*'], { 'DO_state': 'enriched' }, '/sis/arrived-at-depot'),
      () => this.subscribeToEvent('DCParcel', ['*'], { 'DO_state': 'on the way' }, '/sis/pickup-reported'),
      () => this.subscribeToEvent('DCParcel', ['*'], { 'DO_state': 'delivered' }, '/sis/delivery-reported')
    ];
  }

  subscribeToEvents() {
    const $notificationRuleUUIDs = this.subscriptionsToExecute.map(subFunc => subFunc());
    return Promise.all($notificationRuleUUIDs)
      .then(notificationRuleUUIDs => {
        this.notificationRuleUUIDs = notificationRuleUUIDs;
        notificationRuleUUIDs.forEach(uuid => console.log(uuid));
        return notificationRuleUUIDs;
      });
  }

  unsubscribeEvents() {
    const $deletedNotificationRules = this.notificationRuleUUIDs.map(uuid => this.unicornAdapter.unsubscribeFromEvent(uuid));
    return Promise.all($deletedNotificationRules).then(() => console.info("Deleted Notifications"));
  }

  subscribeToEvent(eventName, attributes, options, callbackPath) {
    let callbackUrl = CAZ_BASE_URL + callbackPath;
    return this.unicornAdapter.subscribeToEvent(eventName, attributes, options, callbackUrl);
  }
}

module.exports = UnicornController;
