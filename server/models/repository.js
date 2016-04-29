// Repostiory Model File

// Mongoose package requirement
var mongoose = require('mongoose');

// Schema definition
var Schema = mongoose.Schema;

// if config is prefixed to the field it means we will be getting it from
// the individiual project's config file(if they provide one.)
var repositorySchema = new Schema({
  name              : { Type: String },
  full_name         : { Type: String },
  html_url          : { Type: String },
  contributors_url  : { Type: String },
  created_at        : { Type: Date },
  updated_at        : { Type: Date },
  pushed_at         : { Type: Date },
  homepage          : { Type: String },
  size              : { Type: Number },
  stargazers_count  : { Type: Number },
  watchers_count    : { Type: Number },
  language          : { Type: String },
  forks_count       : { Type: Number },
  subscribers_count : { Type: Number },
  contributors: [{

    // Identify users by login
    login         : { Type: String },
    avatar_url    : { Type: String },
    html_url      : { Type: String },
    contributions : { Type: Number },
    config_role   : { Type: String },
    config_full_name: { Type: String },
  }],
  config_date        : { Type: String},
  config_description : { Type: String },
  config_images      : [{Type: String}],

  // Github API only includes 1 primary language for repo
  config_tags: [{Type: String}],
});

// Export Schema
module.exports = mongoose.model('Repository', repositorySchema);
