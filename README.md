# Caz
> Generic adapter to subscribe to handle communication between Unicorn and Third Party APIs

<!-- [![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Downloads Stats][npm-downloads]][npm-url] -->

Chimera uses events to communicate with third party APIs. In order to make it as easy as possible to establish the connection, Caz provides a generic, easy to configure, framework.

<!-- ![](header.png) -->

## Installation

```sh
git clone https://github.com/bptlab/caz.git
cd caz
npm install             # Install dependencies
npm install -g nodemon  # To restart server on filechange for local development
npm run start           # Start server
```

## Usage

The Caz already provides a simple way to subscribe to certain Unicorn events.

### Subscribe to events

In order to receive messages it is necessary to first subscribe to all events that are of interest.
Please overwrite the `ROUTES` constant in `app.js` with an array that contains an object for each subscription.

*An example of a subscription:*

```javascript
const ROUTES = [{
  event: 'DCParcel',
  attributes: ['*'],
  filters: { 'DO_state': 'delivered' },
  route: '/sis/delivery-reported'
}];
```

CAZ handles registering and also deleting unnecessary subscriptions in Unicorn automatically.

### Handle Notifications

Once an event is generated in Unicorn that matches one or multiple subscriptions CAZ is called with a POST request on the specified route.
The request body contains a JSON object matching the event type that is registered in Unicorn.
The CAZ can now convert the data to a format that is accepted by third party APIs and subsequently call the third party API with the correct data.

*An example of a notification handler:*

```javascript
router.post('/delivery-reported', function (req, res, next) {   // Add route defined by subscription
  const { sscc, receiverID } = req.body;                        // Pick only necessary event information
  const eventXml = epcisEvents.receiving2(sscc, receiverID);    // Convert JSON to XML expected by third party API
  epcisEvents.send(eventXml);                                   // Call third party API with correct data
}, helpers.sendSuccessfullUnicornResponse);                     // Send success response to Unicorn
```

###

## Development setup

To start local development it's enough to run

```sh
npm run start # or
nodemon       # restarts server on filechange
# If you are running the bpt-docker-zoo you can run this command to hook up the CAZ
UNICORN_BASE_URL=http://localhost/smile/unicorn CAZ_BASE_URL=http://host.docker.internal:3000 nodemon
```

![](documentation/caz_workflow.png)

## Release History

> Currently no released Version

* 0.0.1
    * Work in progress

## Meta

Marius Lichtblau – [@lichtblau](https://twitter.com/lichtblau) – marius@lichtblau.io

[Github](https://github.com/mlichtblau)

## Contributing

1. Fork it (<https://github.com/bptlab/caz/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

<!-- Markdown link & img dfn's -->
[npm-image]: https://img.shields.io/npm/v/datadog-metrics.svg?style=flat-square
[npm-url]: https://npmjs.org/package/datadog-metrics
[npm-downloads]: https://img.shields.io/npm/dm/datadog-metrics.svg?style=flat-square
[travis-image]: https://img.shields.io/travis/dbader/node-datadog-metrics/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/dbader/node-datadog-metrics
[wiki]: https://github.com/yourname/yourproject/wiki
