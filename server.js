// The main server file.
// Building a new website for the DG website from scratch.

// Configuration/requirement modules.
// these files are located in the package.json
// SERVER_PORT is the serverport the app will run on for local host.
var express = require('express');
var app = express();
var nunjucks = require('nunjucks');

var SERVER_PORT = 3000;

// Nunjucks view engine setup
nunjucks.configure('views', {
  autoescape: true,
  express: app,
  watch: true,
});

// Set the directory for the server to look for view pages.
app.set('views', 'views');

// setting the view engine sets the default extension to use
// if an extension is omitted.
app.set('view engine', 'html');

// Set path for routes to check for static files(html/css/javascript) in
// the public folder
app.use(express.static('public'));

// Route localhost:3000 and send the text 'Page is here' to the client
app.get('/', function(req, res) {
  res.render('index');
});

app.get('/second', function(req, res) {
  res.render('second');
});

// Listen on port 3000. and display in the terminal 'app running on port 3000'
// if its working.
// app will be running on localhost:3000
app.listen(SERVER_PORT, function() {
  console.log('app running on port ' + SERVER_PORT);
});
