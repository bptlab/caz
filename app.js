var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var UnicornController = require('./unicorn/unicorn').UnicornController;

const unicornController = new UnicornController();
unicornController.subscribeToEvents();

// For nodemon restarts
process.once('SIGUSR2', () => { return unicornController.unsubscribeEvents().catch(error => console.error(error)) });

// For app termination
process.on('SIGINT', () => { return unicornController.unsubscribeEvents().catch(error => console.error(error)) });


var indexRouter = require('./routes/index');
var sisRouter = require('./routes/sis');
var pickshareRouter = require('./routes/pickshare');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.text({ type: ['text/*', 'application/*'] }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/sis', sisRouter);
app.use('/pickshare', pickshareRouter);

module.exports = app;
