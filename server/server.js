// The main server file.
'use strict';

// Requirement modules
var express = require('express');
var app = express();
var nunjucks = require('nunjucks');

// SERVER_PORT is the serverport the app will run on for local host.
var SERVER_PORT = 3000;

// Nunjucks view engine setup
nunjucks.configure('views', {
  express: app,
  watch: true,
});

app.set('view engine', 'html');

app.set('views', 'views');

// Set path for routes
app.use(express.static('public'));

app.get('/', function(req, res) {
  res.render('second', { 
    care: "nunjucks variable"
    });
});

// Listen on port 3000
app.listen(SERVER_PORT, function() {
  console.log('app running on port ' + SERVER_PORT);
});
