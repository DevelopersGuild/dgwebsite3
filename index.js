// The main server file.
// Building a new website for the DG website from scratch.

// Configuration/requirement modules.
// these files are located in the package.json
var express = require('express');
var app = express();
var SERVER_PORT = 3000;

// Route localhost:3000 and send the text 'Page is here' to the client
app.get('/', function(req, res) {
  res.send('Page is here');
});

// Listen on port 3000. and display in the terminal 'app running on port 3000'
// if its working.
// app will be running on localhost:3000
app.listen(SERVER_PORT, function() {
  console.log('app running on port ' + SERVER_PORT);
});
