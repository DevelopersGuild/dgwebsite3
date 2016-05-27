// Routes file for the express app
'use strict';

var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('./config');

// Controller for repositories
var repositories = require('./controllers/repositories');

// Root route
router.get('/', function(req, res) {
    res.render('index', {
        care: "nunjucks variable"
    });
});

// Route for list of repositories
router.get('/repositories', repositories.getRepositoryList);

// Test route to save info to the database
router.get('/repositories/update', repositories.saveRepo);

// Route for individual repository pages
router.get('/repositories/:id', repositories.getRepository);

// Route for slack invite
router.get('/invite', function(req, res) {
    res.render('slack/index', { community: config.community,
        tokenRequired: !!config.inviteToken });
});

router.post('/invite', function(req, res) {
  res.send('blah');
});


// Export routes
module.exports = router;
