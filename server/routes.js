// Routes file for the express app
'use strict';

var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('./config');

// Controller for repositories
var Repositories = require('./controllers/repositories');
var Slack        = require('./controllers/slack');

// Root route
router.get('/', function(req, res) {
    res.render('pages/indexPage/index');
});

// Route for list of repositories
router.get('/projects', Repositories.getRepositoryList);

// Test route to save info to the database
router.get('/repositories/update', Repositories.saveRepo);

// Route for individual repository pages
router.get('/projects/:id', Repositories.getRepository);

router.post('/invite', Slack.postSlackInvite);

// Export routes
module.exports = router;
