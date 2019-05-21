const UnicornAdapter = require('unicorn-adapter');

const UNICORN_BASE_URL = process.env.UNICORN_BASE_URL || "http://unicorn:8080/unicorn";
const CAZ_BASE_URL = process.env.CAZ_BASE_URL || "http://caz:3000";

const CAZ_CALLBACK_URL = `${ CAZ_BASE_URL }/notification`;

const unicornAdapter = new UnicornAdapter(UNICORN_BASE_URL, CAZ_CALLBACK_URL);

class UnicornController {
  constructor(subscriptions) {
    this.notificationRuleUUIDs = [];
    this.subscriptions = subscriptions;
  }

  subscribeToEvents() {
    const $notificationRuleUUIDs = this.subscriptions.map(({ event, attributes, filters, route }) => this.subscribeToEvent(event, attributes, filters, route));
    return Promise.all($notificationRuleUUIDs)
      .then(notificationRuleUUIDs => {
        this.notificationRuleUUIDs = notificationRuleUUIDs;
        notificationRuleUUIDs.forEach(uuid => console.log(uuid));
        return notificationRuleUUIDs;
      });
  }

  unsubscribeEvents() {
    const $deletedNotificationRules = this.notificationRuleUUIDs.map(uuid => unicornAdapter.unsubscribeFromEvent(uuid));
    return Promise.all($deletedNotificationRules).then(() => console.info("Deleted Notifications"));
  }

  subscribeToEvent(eventName, attributes, options, callbackPath) {
    let callbackUrl = CAZ_BASE_URL + callbackPath;
    return unicornAdapter.subscribeToEvent(eventName, attributes, options, callbackUrl);
  }
}

module.exports = {
  UnicornController,
  unicornAdapter
};
