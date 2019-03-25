var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var UnicornController = require('./unicorn/startup');

const unicornController = new UnicornController();
unicornController.subscribeToEvents();

// For nodemon restarts
process.once('SIGUSR2', () => { unicornController.unsubscribeEvents() });

// For app termination
process.on('SIGINT', () => { unicornController.unsubscribeEvents() });


var indexRouter = require('./routes/index');
var sisRouter = require('./routes/sis');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.text({ type: ['text/*', 'application/*'] }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/sis', sisRouter);

module.exports = app;
