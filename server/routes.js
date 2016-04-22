// Routes file for the express app
'use strict';

var express = require('express');

var router = express.Router();

// Root route
router.get('/', function(req, res) {
    res.render('second', {
        care: "nunjucks variable"
    });
});

// Route for list of repositories
router.get('/repositories', function(req, res) {
    // TODO: repo list code goes here

    res.render('./repositories/index.html', {
        lol: 'l0ool'
    });
});

// Route for individual repository pages
router.get('/repositories/:id', function(req, res) {
    // TODO: specific repo code goes here

    res.render('./repositories/show.html', {
        lmao: 'Ayy lmao'
    })
});

// Export routes
module.exports = router;