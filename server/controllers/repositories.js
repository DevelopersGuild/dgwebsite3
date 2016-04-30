// Repositories controller for GitHub integration
'use strict';

var markdown = require( "markdown" ).markdown;
var request = require('request');
var async = require('async')

exports.getRepoList = function(req, res) {
    // TODO: get list of repositories with URLs
    
  var URL = 'https://api.github.com/orgs/DevelopersGuild/repos';

  var reqOptions = {
    url: URL,
    headers: {
      'User-Agent' : 'BlueAccords'
    }
  };

  var nameArr = [];

  request(reqOptions, function (err, response, body) {

    if (err || response.statusCode !== 200) {
      return res.send(err);
    }

    body = JSON.parse(body);
    // console.log(body);
    var repoList = [];
    var urlArr = [];
    var nameArr = [];

    for(var item in body) {
      var repoURL = "";
      // console.log(body[item].full_name);
      repoURL = 'https://raw.githubusercontent.com/' + (body[item].full_name +
                '/master/README.md');
      // getRepoReadMe(repoURL);
      // urlArr.push(repoURL);
      nameArr.push({
        name: body[item].name,
        // url: body[item].full_name,
        url: "/repositories/" + body[item].name
      });
    }

    res.render('repoList', {
      projects: nameArr,
    });
  });
};

exports.saveRepo = function(req, res) {
  var URL = 'https://api.github.com/users/DevelopersGuild/' + req.params.id;

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
    console.log(body);

    res.render('repoList');
  });


}

exports.getRepository = function(req, res) {
    // TODO: get individual repository object
    var url = 'https://raw.githubusercontent.com/DevelopersGuild/' + req.params.id +
              '/master/README.md';

  console.log('url = ' + url);

  getRepoReadMe(url, function(readme) {
    if(readme !== null) {
      res.render('pagetemplate', {
        content: readme,
        project_name: req.params.id,
      });
    } else {
      res.render('pagetemplate', {
        content: 'NOT FOUND',
      });
    }
  });
};

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
