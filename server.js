// The main server file.
// Building a new website for the DG website from scratch.

// Configuration/requirement modules.
// these files are located in the package.json
// SERVER_PORT is the serverport the app will run on for local host.
var express = require('express');
var app = express();
var nunjucks = require('nunjucks');
var https = require("https"); // for doing the http get
var markdown = require( "markdown" ).markdown;
var request = require('request');
var async = require('async');
var SERVER_PORT = 3000;

var importantValue = "";

// Pull README.md from GitHUB
var options = {
  host: 'raw.githubusercontent.com',
  port: 443,
  path: '/DevelopersGuild/dgwebsite2/master/README.md',
  method: 'GET'
};

var req = https.request(options, function(res) {
  console.log(res.statusCode);
  res.on('data', function(d) {
    importantValue += d;
  });
});

req.end();

req.on('error', function(e) {
  console.error(e);
});

// html_content = markdown.toHTML( importantValue );
// console.log( markdown.toHTML( importantValue ) );

// Nunjucks view engine setup
nunjucks.configure('views', {
  autoescape: true,
  express: app,
  watch: true,
});



app.set('view engine', 'html');

app.set('views', 'views');


// Set path for routes to check for static files(html/css/javascript) in
// the public folder
app.use(express.static('public'));

// Route localhost:3000 and send the text 'Page is here' to the client
app.get('/', function(req, res) {
  html_content = markdown.toHTML( importantValue );
  res.render('index',{
    importantValue: html_content
  });
});

app.get('/repos', function(req, res) {
  // var URL = 'https://raw.githubusercontent.com' +
  //           '/DevelopersGuild/dgwebsite2/master/README.md';
  var URL = 'https://api.github.com/orgs/DevelopersGuild/repos';

  var reqOptions = {
    url: URL,
    headers: {
      'User-Agent' : 'BlueAccords'
    }
  };

  request(reqOptions, function (err, response, body) {

    if (err || response.statusCode !== 200) {
      return res.send(err);
    }

    body = JSON.parse(body);
    // console.log(body);
    var repoList = [];
    var urlArr = [];

    for(var item in body) {
      var repoURL = "";
      // console.log(body[item].full_name);
      repoURL = 'https://raw.githubusercontent.com/' + (body[item].full_name +
                '/master/README.md');
      // getRepoReadMe(repoURL);
      urlArr.push(repoURL);
    }

    // console.log(urlArr);

    var htmlBody = "";

    async.each(urlArr,
      function(item, cb) {
        console.log('itemname:');
        console.log(item);
        getRepoReadMe(item, function(body) {
          if(body !== null) {
            repoList.push(body);
          }

          cb();
        });
      }, function done(){
        console.log('fullRepoList =');
        // console.log(repoList);
        console.log('replist size = ' + repoList.length);
        res.render('index', { importantValue : repoList });
      });

    });
  });


// Gets a Repo's README
// @url; the url for the api call on github
// @done; the callback to call when the api call is done.
//  Also returns null or the html body of the readme
function getRepoReadMe(url, done) {
  console.log('API CALL');

  var reqOptions = {
    url: url,
    headers: {
      'User-Agent' : 'BlueAccords'
    }
  };

  request(reqOptions, function (err, response, body) {

    if (err || response.statusCode !== 200) {
      console.log(err);
      return done(null);
    }

    body = markdown.toHTML( body );

    done(body);
  });
}

app.get('/second', function(req, res) {
  res.render('second');
});

// Listen on port 3000. and display in the terminal 'app running on port 3000'
// if its working.
// app will be running on localhost:3000
app.listen(SERVER_PORT, function() {
  console.log('app running on port ' + SERVER_PORT);
});
