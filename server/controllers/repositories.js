// Repositories controller for GitHub integration
'use strict';

var getRepositoryList = function() {
    // TODO: get list of repositories with URLs
    
  var URL = 'https://api.github.com/orgs/DevelopersGuild/repos';

  var reqOptions = {
    url: URL,
    headers: {
      'User-Agent' : 'BlueAccords'
    }
  };
  var nameArr = [];

  request(reqOptions, function (err, response, body) {

    if (err || response.statusCode !== 200) {
      return res.send(err);
    }

    body = JSON.parse(body);
    // console.log(body);
    var repoList = [];
    var urlArr = [];
    var nameArr = [];

    for(var item in body) {
      var repoURL = "";
      // console.log(body[item].full_name);
      repoURL = 'https://raw.githubusercontent.com/' + (body[item].full_name +
                '/master/README.md');
      // getRepoReadMe(repoURL);
      // urlArr.push(repoURL);
      nameArr.push({
        name: body[item].name,
        // url: body[item].full_name,
        url: "/repos/" + body[item].name
      });
    }

    res.render('repoList', {
      projects: nameArr,
    });
  });
};

var getRepository = function(repo) {
    // TODO: get individual repository object
    var url = 'https://raw.githubusercontent.com/DevelopersGuild/' + repo +
              '/master/README.md';

  console.log('url = ' + url);

  getRepoReadMe(url, function(readme) {
    if(readme !== null) {
      res.render('pagetemplate', {
        content: readme
      });
    } else {
      res.render('pagetemplate', {
        content: 'NOT FOUND',
      });
    }
  });
};
