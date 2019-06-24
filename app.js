var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');

const subscriptionController = require('./subscriptions');
subscriptionController.subscribeToEvents();
// For nodemon restarts
process.once('SIGUSR2', () => { return subscriptionController.unsubscribeEvents() });

// For app termination
process.on('SIGINT', () => { return subscriptionController.unsubscribeEvents() });
process.on('SIGTERM', () => { return subscriptionController.unsubscribeEvents() });

var indexRouter = require('./routes/index');
var sisRouter = require('./routes/sis');
var pickshareRouter = require('./routes/pickshare');
var tmsRouter = require('./routes/tms');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.text({ type: ['text/*', 'application/*'] }));
app.use(cookieParser());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/', indexRouter);
app.use('/sis', sisRouter);
app.use('/pickshare', pickshareRouter);
app.use('/tms', tmsRouter);
app.use('/subscriptions', subscriptionController.router);

module.exports = app;
