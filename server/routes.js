// Routes file for the express app
'use strict';

var express = require('express');

var router = express.Router();

// Controller for repositories
var repositories = require('./controllers/repositories');

// Root route
router.get('/', function(req, res) {
    res.render('second', {
        care: "nunjucks variable"
    });
});

// Route for list of repositories
router.get('/repositories', repositories.getRepoList);

// Route for individual repository pages
router.get('/repositories/:id', repositories.getRepository);

// Export routes
module.exports = router;
