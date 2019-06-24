const express = require('express');
const router = express.Router();
const getUUID = require('uuid/v4');

const SUBSCRIPTIONS = require('./subscriptions');

const UnicornController = require('../unicorn/unicorn').UnicornController;
const unicornController = new UnicornController();

const helpers = require('../helpers');

function subscribeToEvents() {
  return Promise.all(SUBSCRIPTIONS.map(subscription => {
    const uuid = getUUID();
    return unicornController.subscribeToEvent(subscription.event, `/subscriptions/${ uuid }`)
      .then(notificationRuleUUID => {
        router.post(`/${ uuid }`, ({ body: event }, res, next) => {
          subscription.handler(event, next);
        }, helpers.sendSuccessfullUnicornResponse);
        console.info(`Registered callback '${ `/subscriptions/${ uuid }` }' for Rule '${ notificationRuleUUID }'`);
      });
  }));
}

function unsubscribeEvents() {
  return unicornController.unsubscribeEvents().catch(error => console.error(error));
}

module.exports = {
  subscribeToEvents,
  unsubscribeEvents,
  router
};