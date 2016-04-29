// The main server file.
'use strict';

// Requirement modules
var express = require('express');
var nunjucks = require('nunjucks');

var app = express();
var routes = require('./routes');

// SERVER_PORT is the serverport the app will run on for local host.
var SERVER_PORT = 3000;

// Nunjucks view engine setup
nunjucks.configure('./client/views', {
  express: app,
  watch: true,
});

app.set('view engine', 'html');

// App currently works without this somehow
//app.set('views', './client/views');

// Set path for assets
app.use(express.static('public'));

// Use routes path in express app
app.use(routes);

// Listen on port 3000
app.listen(SERVER_PORT, function() {
  console.log('app running on port ' + SERVER_PORT);
});
