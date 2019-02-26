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

_For more development information, please refer to the [Wiki][wiki]._

## Usage

The Caz already provides a simple way to subscribe to certain Unicorn events.

## Development setup

To start local development it's enough to run

```sh
npm run start # or
nodemon       # restarts server on filechange
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
