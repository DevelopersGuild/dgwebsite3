// Repositories controller for GitHub integration
'use strict';

var markdown = require( "markdown" ).markdown;
var request = require('request');
var async = require('async');
var config = require('../config');
var Repository = require('../models/repository');


// Makes request to github for all repo info under developer's guild
// Gets a list of their names and then renders a list of repos
// and links to a route that will show their individual README files 
exports.refreshRepoList = function(req, res) {
    Repository.saveRepo();
};

exports.renderRepoList = function(req, res) {
  // fetch from db
  var nameArr = [];
  
  // render
  res.render('repoList', {
      projects: nameArr,
    });
};

/**
 * Function makes a github api request for repo list information
 * of all the repositories that belong to Developers' Guild
 * Then it makes individual requests to each repo and saves to db
 */
exports.saveRepo = function(req, res) {
  var clientParams = config.githubClientParams;

  var URL = 'https://api.github.com/orgs/DevelopersGuild/repos' + clientParams;
  var reqOptions = {
    url: URL,
    headers: {
      'User-Agent' : 'vihanchaudhry'
    }
  };

  request(reqOptions, function (err, response, body) {

    // console.log(body);

    if (err || response.statusCode !== 200) {
      return res.send(err);
    }

    body = JSON.parse(body);

    async.each(body, function(item, callback) {
      var URL = 'https://api.github.com/repos/DevelopersGuild/' + item.name + clientParams;

      var reqOptions = {
        url: URL,
        headers: {
          'User-Agent' : 'vihanchaudhry'
        }
      };

      requestRepository(reqOptions, function(err, result) {
        if(err) console.log('error code: ' + err.code);

        callback();
      });
    }, function() { // Called when everything else is done
      console.log("Saved everything.");
      res.send("lol");
    });
  });
};

exports.getRepository = function(req, res) {
  Repository.findOne({
    name: req.params.id
  }, function(err, repository) {
    if (err) return res.send(err);
    res.send(repository);
  })
};

/**
 * Renders list of repositories
 */
exports.getRepositoryList = function(req, res) {
  // TODO: get individual repository object from db
  Repository.find({}, function(err, repositories) {
    if (err) return res.send(err);
    res.render('repoList', {
      projects: repositories
    })
  });
};

// Request individual repository from github api and saves to db
function requestRepository(reqOptions, callback) {
  request(reqOptions, function (err, response, body) {
    if (err || response.statusCode !== 200) {
      return callback(err);
    } else {
      body = JSON.parse(body);

      // var repository = new Repository(body);

      // repository.save(function(err, repository) {
      //   if (err) return callback(err);
      //   callback(repository);
      // });

      var query = { full_name: body.full_name },
          update = body,
          options = { upsert: true, new: true, setDefaultsOnInsert: true};

      Repository.findOneAndUpdate(query, update, options, function(err, result) {
        if(err) return callback(err);

        console.log(result.full_name + " saved");
        callback(null, result);
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
