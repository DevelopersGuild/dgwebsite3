'use strict';


// Source: http://www.scotchmedia.com/tutorials/express/authentication/1/06
// This file:
// 1. connects mongoose to the mongodb database process(mongod needs to be running)
// 1a. If database is already connected just clears the database
// 2. drops the test database before all the tests are done after connection is made
// 3. after all the tests are done disconnect mongoose database connection

// 
var config = require('../server/config');
var mongoose = require('mongoose');


// ensure the NODE_ENV is set to 'test'
// this is helpful when you would like to change behavior when testing
process.env.NODE_ENV = 'test';


beforeEach(function (done) {


  function clearDB() {
    for (var i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove(function() {});
    }
    return done();
  }


  if (mongoose.connection.readyState === 0) {
    mongoose.connect(config.db.test, function (err) {
      if (err) {
        throw err;
      }
      return clearDB();
    });
  } else {
    return clearDB();
  }
});


afterEach(function (done) {
  mongoose.disconnect();
  return done();
});