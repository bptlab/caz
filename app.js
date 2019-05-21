var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var UnicornController = require('./unicorn/unicorn').UnicornController;

const SUBSCRIPTIONS = [
  { event: 'DCParcel', attributes: ['*'], filters: { 'DO_state': 'ready' }, route: '/sis/arrived-at-depot' },
  { event: 'DCParcel', attributes: ['*'], filters: { 'DO_state': 'on the way' }, route: '/sis/pickup-reported' },
  { event: 'DCParcel', attributes: ['*'], filters: { 'DO_state': 'delivered' }, route: '/sis/delivery-reported' },
  { event: 'DCParcel', attributes: ['*'], filters: { 'DO_state': 'registered' }, route: '/pickshare/parcel-registered' },
  { event: 'DCTimeSlotOffer', attributes: ['*'], filters: { 'DO_state': 'created' }, route: '/pickshare/time-slot-offer-created' },
  { event: 'DCParcel', attributes: ['*'], filters: { 'DO_state': 'delivered' }, route: '/pickshare/delivery-reported' }
];

const unicornController = new UnicornController(SUBSCRIPTIONS);
unicornController.subscribeToEvents();

// For nodemon restarts
process.once('SIGUSR2', () => { return unicornController.unsubscribeEvents().catch(error => console.error(error)) });

// For app termination
process.on('SIGINT', () => { return unicornController.unsubscribeEvents().catch(error => console.error(error)) });


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

module.exports = app;
