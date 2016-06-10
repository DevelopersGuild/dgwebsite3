// The main server file.
'use strict';

// Requirement modules
var express = require('express');
var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');

// mongodb ORM
var mongoose = require('mongoose');

var app = express();
var routes = require('./routes');
var config = require('./config');

// SERVER_PORT is the serverport the app will run on for local host.
var SERVER_PORT = 3000;

// Connect to database
// Output error to database if error occurs
// On open output success message to console
// Will connect to different databases depending on NODE_ENV setting
switch(process.env.NODE_ENV) {
  case 'test':
    mongoose.connect(config.dbTest);
    console.log('db is connecting to test database')
    break;
  case 'development': 
    mongoose.connect(config.dbDevelopment);
    console.log('db is connecting to development database')
    break;
  case 'production':
    mongoose.connect(config.dbProduction);
    console.log('db is connecting to production database')
    break;
  default:
    mongoose.connect(config.dbDevelopment);
    console.log('db is connecting to development database')
}

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('db is connected to mongodb')
});

// Nunjucks view engine setup
nunjucks.configure('./client/views', {
  express: app,
  watch: true,
});

app.set('view engine', 'html');

app.use(bodyParser.urlencoded({ extended: false }));

// App currently works without this somehow
//app.set('views', './client/views');

// Set path for assets
app.use(express.static('public'));

// Use routes path in express app
app.use(routes);

// Run jobs
// Job1: Update repositories collection via github api every 24 hours
var job = require('./jobs/refreshRepoDataJob.js');

// Listen on port 3000
app.listen(SERVER_PORT, function() {
  console.log('app running on port ' + SERVER_PORT);
});