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
  // Max limit of results per page is 100
  // TODO: add pagination to this request
  var pagesPerRequest = '&per_page=100';

  var URL = 'https://api.github.com/orgs/DevelopersGuild/repos' + clientParams + pagesPerRequest;
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

      console.log('attempting to save info for ... ' + item.full_name);

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
      // callback();
    }, function() { // Called when everything else is done
      console.log("Saved everything.");
      res.send(body);
    });
  });
};

/**
 * Makes a request to the database to get one repository object from
 * the database using the passed in params id(via the url repositories/:id)
 *
 * @return { json } Returns JSON object containing repository information inside a json object
 */
exports.getRepository = function(req, res) {
  Repository.findOne({
    name: req.params.id
  }, function(err, repository) {
    if (err) return res.send(err);

    res.send(repository);
  })
};

/**
 * Makes a request to the database for the entire list of repository projects
 * Renders a page with the project names and links to the individual pages
 *
 * @return {Render} [Renders a page to the view once finished
 *                   Otherwise render the error message]
 */
exports.getRepositoryList = function(req, res) {
  Repository.find({}, function(err, repositories) {
    if (err) return res.send(err);
    res.render('repoList', {
      projects: repositories
    })
  });
};

/**
 * Request individual repository from github api and saves to db
 * @param  {json}   reqOptions [ Send request options for the api request]
 * @param  {Function} callback   [callback function to call upon completion of the function]
 * @return {Function}              [End of function executes the callback whether it succeeds or fails]
 */
function requestRepository(reqOptions, callback) {
  request(reqOptions, function (err, response, body) {
    if (err || response.statusCode !== 200) {
      return callback(err);
    } else {
      body = JSON.parse(body);

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

/**
 * [getRepoReadMe Gets a repository's individual readme file]
 * @param  {String}   url  [URL of the readme file within the repository]
 * @param  {Function} done [callback function to call upon completion/failure]
 */
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
