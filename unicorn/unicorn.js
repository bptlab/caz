const UnicornAdapter = require('unicorn-adapter');

const UNICORN_BASE_URL = process.env.UNICORN_BASE_URL || "http://unicorn:8080/unicorn";
const CAZ_BASE_URL = process.env.CAZ_BASE_URL || "http://caz:3000";

const CAZ_CALLBACK_URL = `${ CAZ_BASE_URL }/notification`;

const unicornAdapter = new UnicornAdapter(UNICORN_BASE_URL, CAZ_CALLBACK_URL);

class UnicornController {
  constructor() {
    this.notificationRuleUUIDs = [];
  }

  subscribeToEvent({ eventName, attributes, filters }, route) {
    return unicornAdapter.subscribeToEvent(eventName, attributes, filters, CAZ_BASE_URL + route)
      .then(notificationRuleUUID => {
        this.notificationRuleUUIDs.push(notificationRuleUUID);
        console.info(`Create Notification rule for ${ eventName } with id: ${ notificationRuleUUID}`);
        return notificationRuleUUID;
      });
  }

  unsubscribeEvents() {
    const $deletedNotificationRules = this.notificationRuleUUIDs.map(uuid => unicornAdapter.unsubscribeFromEvent(uuid));
    return Promise.all($deletedNotificationRules).then(() => console.info("Deleted Notifications"));
  }
}

module.exports = {
  UnicornController,
  unicornAdapter
};
