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
 * Makes a request via Github API to developer's guild organization
 * Gets list of repo json data from request
 * Loops through list of repos
 *  Makes individual Github API request to each repo
 *  Saves Data from individual repositories to database
 *    If repo does not exist in database then create a new object for the repo
 *
 *  Returns results to view as json object 
 */
exports.saveRepo = function(req, res) {
  var clientParams = config.githubClientParams;
  // Max limit of results per page is 100
  // TODO: add pagination to this request
  var pagesPerRequest = '&per_page=100';

  // URL and options for api request
  var URL = 'https://api.github.com/orgs/DevelopersGuild/repos' + clientParams + pagesPerRequest;
  var reqOptions = {
    url: URL,
    headers: {
      'User-Agent' : 'vihanchaudhry'
    }
  };

  /**
   * Use request library to make api request to github for list of repository information
   * From the Developer's Guild organization
   * @param  {[json]} err      [Error Object(null if no error)]
   * @param  {[json]} response [response object that includes success/failure]
   * @param  {[json]} body     [Result of api request]
   */
  request(reqOptions, function (err, response, body) {
    
    // Error checking 
    if (err || response.statusCode !== 200) {
      return res.send(err);
    }
    
    // Convert result into JSON
    body = JSON.parse(body);
    
    // Asynchronously Loop through list of repo urls
    async.each(body, function(item, callback) {
      // Individual repository information via github api
      var URL = 'https://api.github.com/repos/DevelopersGuild/' + item.name + clientParams;

      console.log('attempting to save info for ... ' + item.full_name);
      
      // API request options
      var reqOptions = {
        url: URL,
        headers: {
          'User-Agent' : 'vihanchaudhry'
        }
      };
      
      /**
       * Helper function to make api request for individual repo information
       * @param  {json} reqOptions[ API request options ]
       * @param  {json} result    [ Result of api request]
       * @return {Function}       [ Callback function once request is finished to end one iteration
       *                            of the aynchronus loop ]
       */
      requestRepository(reqOptions, function(err, result) {
        if(err) console.log('error code: ' + err.code);

        callback();
      });
      /**
       * Final Callback function after the loop is done
       * @return {json} [Currently just sends json to view]
       */
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
 * Checks if repository already exists in the database
 *  If the repo already exists then just update information
 *  If the repo DOES NOT exist then create a new repo object and save it
 * 
 * @param  {json}   reqOptions   [ Send request options for the api request]
 * @param  {Function} callback   [callback function to call upon completion of the function]
 * @return {Function}            [End of function executes the passed in callback whether it succeeds or fails]
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
  
  // API request options
  var reqOptions = {
    url: url,
    headers: {
      'User-Agent' : 'BlueAccords'
    }
  };
  
  /**
   * Make the api request using request library
   * @param {json} reqOptions [API request options]
   * @param {json} err [Error object(null if no error)]
   * @param {json} response [Response object passed from the api request(includes HTTP status code)]
   * @param {json} body [Returned content from the api request.
   *                     Includes README contents]
   */
  request(reqOptions, function (err, response, body) {

    if (err || response.statusCode !== 200) {
      console.log(err);
      return done(null);
    }

    body = markdown.toHTML( body );

    done(body);
  });
}

/* Make request to org
  *  > Iterate through pages(build an array of repo objects)
  *  >> Iterate through final built list of repo objects
  *  >>> Save individual information of each repo to database
  *  >>>> Make request to individual repos to check for existence of config file
  *  >>>> Save config file to database for each repo
  */
exports.requestPagination = function(req, res) {
  /**
   * doWhilst is an asynchronus do while loop
   * This is so it will execute AT LEAST once.
   * 
   * @param {function} [fn(callback)] 
   *  [function that is called AT LEAST once
   *   And will continued to be called until TEST function is false.
   *   To exit this loop to enter the next test loop call 
   *   the passed in callback function]
   *   
   * @param {function} [test]
   *  [The function to test for true/false and will end the loop
   *   Once it is false]
   *   
   * @param {function} [callback(err, result)] 
   *  [callback function that is called once the loop is finished.
   *   Will also be passed results from last callback in test function]
   */
  async.doWhilst(
    // Execution Function(called each loop)
    function(callback){
      console.log('called once');
    },
    // Test Function(tests for true/false to continue or exit the loop)
    function(){
      return false;
    },
    // final callback function(called if error or when done)
    function(){
      res.send('completed')
    });
}