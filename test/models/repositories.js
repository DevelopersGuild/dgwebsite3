'use strict';

// Test file for testing functions of respositories model

// Requirements

// Util file used to reset database once before all tests are done
var utils = require('../utils');

// Chai is the test runner used to test functions and values
var chai   = require('chai'),
    expect = chai.expect,
    should = chai.should();

// import our Repository mongoose model
var Repository = require('../../server/models/repository');

describe('Repository', function () {

  // Test whether or not repos are unique by full_name field or not
  // repos SHOULD NOT allow duplicates by full_name
  it('Should NOT allow any duplicates', function (done) {
    var repo = {
      full_name: 'Weiss'
    }

    var repoDupe = {
      full_name: 'Weiss'
    }

    var repoSaved = new Repository(repo);
    var repoDupeSaved = new Repository(repoDupe);

    // Save first repo
    repoSaved.save(function(err, result) {
      should.not.exist(err);

      repoDupeSaved.save(function(err, result) {
        err.should.not.be.undefined;
        err.code.should.equal(11000);
        should.not.exist(result);

        done();
      });
    });
  });
});