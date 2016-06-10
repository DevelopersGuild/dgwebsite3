// Repositories controller for GitHub integration
'use strict';

var markdown = require("markdown").markdown;
var request = require('request');
var async = require('async');
var config = require('../config');
var Repository = require('../models/repository');


// Makes request to github for all repo info under developer's guild
// Gets a list of their names and then renders a list of repos
// and links to a route that will show their individual README files 
exports.refreshRepoList = function (req, res) {
    Repository.saveRepo();
};

/**
 * Makes a request to the database to get one repository object from
 * the database using the passed in params id(via the url repositories/:id)
 *
 * @return { json } Returns JSON object containing repository information inside a json object
 */
exports.getRepository = function (req, res) {
    Repository.findOne({
        name: req.params.id
    }, function (err, repository) {
        if (err) return res.send(err);

        res.render('repositories/show', {
            project: repository
        });
    })
};

/**
 * Makes a request to the database for the entire list of repository projects
 * Renders a page with the project names and links to the individual pages
 *
 * @return {Render} [Renders a page to the view once finished
 *                   Otherwise render the error message]
 */
exports.getRepositoryList = function (req, res) {
    Repository.find({}, function (err, repositories) {
        if (err) return res.send(err);

        res.render('repositories/index', {
            projects: repositories
        })
    });
};

/**
 * [getRepoReadMe Gets a repository's individual readme file]
 * @param  {String}   url  [URL of the readme file within the repository]
 * @param  {Function} done [callback function to call upon completion/failure]
 */
function getDGConfig(repoName, done) {

    var url = "https://raw.githubusercontent.com/DevelopersGuild/" + repoName + "/master/dgconfig.json";

    // API request options
    var reqOptions = {
        url: url,
        headers: {
            'User-Agent': 'BlueAccords'
        }
    };

    /**
     * Make the api request using request library
     * @param {json} reqOptions [API request options]
     * @param {json} err [Error object(null if no error)]
     * @param {json} response [Response object passed from the api request(includes HTTP status code)]
     * @param {json} body [Returned content from the api request.
     *                     Includes dgconfig.json contents]
     */
    request(reqOptions, function (err, response, body) {

        if (err || response.statusCode !== 200) {
            return done(err);
        }

        body = JSON.parse(body);

        done(null, body);
    });
}


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
exports.saveRepo = function (req, res) {
    var clientParams = config.githubClientParams;

    // URL and options for api request
    var URL = 'https://api.github.com/orgs/DevelopersGuild/repos' + clientParams;
    var reqOptions = {
        url: URL,
        headers: {
            'User-Agent': 'vihanchaudhry'
        }
    };


    paginateRepos(function (err, body) {

        // // Error checking
        // if (err || response.statusCode !== 200) {
        //   return res.send(err);
        // }

        // // Convert result into JSON
        // body = JSON.parse(body);

        // Asynchronously Loop through list of repo urls
        async.each(body, function (item, callback) {
            // Individual repository information via github api
            var URL = 'https://api.github.com/repos/DevelopersGuild/' + item.name + clientParams;

            console.log('attempting to save info for ... ' + item.full_name);

            // API request options
            var reqOptions = {
                url: URL,
                headers: {
                    'User-Agent': 'vihanchaudhry'
                }
            };

            /**
             * Helper function to make api request for individual repo information
             * @param  {json} reqOptions[ API request options ]
             * @param  {json} result    [ Result of api request]
             * @return {Function}       [ Callback function once request is finished to end one iteration
             *                            of the aynchronus loop ]
             */
            requestRepository(reqOptions, item.name, function (err, result) {
                if (err) console.log('error code: ' + err.code);

                callback();
            });
            /**
             * Final Callback function after the loop is done
             * @return {json} [Currently just sends json to view]
             */
        }, function () { // Called when everything else is done
            console.log("Saved everything.");
            console.log(body.length + " repos saved");
            res.send(body);
        });
    });
};

/* Make request to org
 *  > Iterate through pages(build an array of repo objects)
 *  >> Iterate through final built list of repo objects
 *  >>> Save individual information of each repo to database
 *  >>>> Make request to individual repos to check for existence of config file
 *  >>>> Save config file to database for each repo
 *  >>>>> do final callback and return list of all repo objects
 */
function paginateRepos(done) {
    // URL and options for api request
    // Defined outside the loop sa they will need to change later
    var clientParams = config.githubClientParams;
    var URL = 'https://api.github.com/orgs/DevelopersGuild/repos' + clientParams;
    var reqOptions = {
        url: URL,
        headers: {
            'User-Agent': 'vihanchaudhry'
        }
    };

    // This is the previous link object(starts out empty)
    // It will be updated each iteration and checked to see if the "next"
    // property exists and if it does not the loop will exit
    var lastLinksObject = null;

    // List of repos from ALL pages
    var repoList = [];

    /**
     * doWhilst is an asynchronus do while loop
     * This is so it will execute AT LEAST once.
     *
     * @param {function} [fn(callback)]
     *  [function that is called AT LEAST once
     *   And will continued to be called until TEST function is false.
     *   To exit this loop and enter the next test loop
     *   call the passed in callback function]
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
        function (callback, thing) {


            console.log('making request on... ');
            console.log(reqOptions);
            console.log('new options...')
            reqOptions.url = URL;
            console.log(reqOptions);
            /**
             * Use request library to make api request to github for list of repository information
             * From the Developer's Guild organization
             * @param  {[json]} err      [Error Object(null if no error)]
             * @param  {[json]} response [response object that includes success/failure]
             * @param  {[json]} body     [Result of api request]
             */
            request(reqOptions, function (err, response, body) {
                if (err) callback(err);

                // Set link response to the returned link object
                // which will contain, next, previous, and last relational api links
                var linkResponse = response.headers.link;

                linkParser(linkResponse, function (err, links) {
                    if (err) callback(err);

                    // Set last link object to resulting parsed links object
                    lastLinksObject = links;

                    // Append body from response to repo list
                    body = JSON.parse(body);
                    repoList.push.apply(repoList, body);

                    // Set new URL to NEXT PAGE url
                    URL = lastLinksObject.next;
                    callback(null, links);
                });
            });
        },
        // Test Function(tests for true/false to continue or exit the loop)
        function(){
            // Checks if the link object has a next page or not
            // If it DOES NOT then exit the loop
            // if it DOES have a next page then continue the loop
            console.log('CONTINUE LOOP? ' + lastLinksObject.hasOwnProperty('next'));
            return lastLinksObject.hasOwnProperty('next');
        },
        // final callback function(called if error or when done)
        function(err, result){
            if(err) done(err);

            // Send results to callback function
            done(null, repoList);
        });
}


/**
 * This function parses the link object in the returned header object
 * from the github api request and returns an object of links
 * to the next, previous, and last pages of the request result
 * of the number of results exceeds a single page.
 * @param  {json} linksHeader [link header object from api request]
 * @param  {function} done    [callback function for when everything is done]
 * @return {json}             [returns a json object with the keys being the rel type
 *                             Types being: next, last, prev,
 *                             Keys being: urls to make further api requests for different pages ]
 *
 * Source: https://github.com/jfromaniello/parse-links
 * Licensed under MIT license
 */
function linkParser(linksHeader, done) {
    var result = {};

    // Split the links Header object into individual objects
    // Each one consists of:
    //  the api link to a page
    //  the rel type(prev, next, last)
    var entries = linksHeader.split(',');

    /* regex.
     * Example source text:
     * Link: <https://api.github.com/search/code?q=addClass+user%3Amozilla&per_page=50&page=2>; rel="next",
     * <https://api.github.com/search/code?q=addClass+user%3Amozilla&per_page=50&page=20>; rel="last"
     */

    // rels regex gets the contents of the rel.
    // i.e this will get 'rel="last"' from the source
    var relsRegExp = /\brel="?([^"]+)"?\s*;?/;

    // keys RegEx used to get the contents of rel from
    // i.e. this will get 'first' from ""first""
    var keysRegExp = /(\b[0-9a-z\.-]+\b)/g;

    // source regex will get the api link within < > brackets
    var sourceRegExp = /^<(.*)>/;

    // Iterate through eall the entry blocks(usually there's only next, last, and prev)
    for (var i = 0; i < entries.length; i++) {
        var entry = entries[i].trim();

        // Get the rels block
        // i.e rel="last"
        var rels = relsRegExp.exec(entry);

        // Check if a rel exists in the block
        if (rels) {

            // Get a key from the rel block
            // [1] is used to get the 2nd match from the rel block(which will be the "" content)
            var keys = rels[1].match(keysRegExp);

            // Get the api url from the entry block inside of < >
            // [1] is used to only get the url, [0] would get the <url> brackets AS WELL
            // as the url
            var source = sourceRegExp.exec(entry)[1];

            // Define vars for the for loop and set it to the length of found rel keys
            var k, kLength = keys.length;

            // Iterate through the key list and
            // set the keys to the rel content
            // set the value of the key to the url of the entry block
            for (k = 0; k < kLength; k += 1) {
                result[keys[k]] = source
            }
        }
    }

    // Exit the function via callback and return the result
    done(null, result);
}


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
function requestRepository(reqOptions, repoName, callback) {

    // Make api request using given request options
    request(reqOptions, function (err, response, body) {
        if (err || response.statusCode !== 200) {
            return callback(err);
        } else {
            // configRes is the result of getDGConfig
            getDGConfig(repoName, function(err, configRes) {
                if (err) {
                    callback(err);
                }

                var currentRepo = JSON.parse(body);
                if (configRes) {
                    currentRepo.config = configRes.config;
                }

                // Query to search the database for the repo's full_name
                // the update contents to update the database with is the contents of the body
                // options
                //  upsert = update info,
                //  new = if no object found then create a new object
                //  setDefaultsOnInsert = set default fields from model if they all aren't there
                var query = {full_name: currentRepo.full_name},
                    update = currentRepo,
                    options = {upsert: true, new: true, setDefaultsOnInsert: true};

                // Make a request to the database to create OR update an object.
                // If object is not found then create a new one in the database
                Repository.findOneAndUpdate(query, update, options, function (err, result) {
                    if (err) return callback(err);

                    console.log(result.full_name + " saved");

                    // Callback to end the function and return the updated/newly created object
                    callback(null, result);
                });
            });
        }
    });
}