'use strict';

// duplicate this file and rename it "config.js" without quotes and fill in the params
// your github api client id
//    YOUR-CLIENT-ID-HERE
// your github api secret id
//    YOUR-CLIENT-SECRET-HERE
// Your slack invite token
//    YOUR-TOKEN-HERE

module.exports = { 
	githubClientParams: '?client_id=YOUR-CLIENT-ID-HERE&client_secret=YOUR-CLIENT-SECRET-HERE',

    // your community or team name to display on join page.
    community: process.env.COMMUNITY_NAME || "Developers' Guild",
    // your slack team url (ex: socketio.slack.com)
    slackUrl: process.env.SLACK_URL || 'dgclub.slack.com',
    // access token of slack
    // You can generate it in https://api.slack.com/web#auth
    // You should generate the token in admin user, not owner.
    // If you generate the token in owner user, missing_scope error will be occurred.
    //
    // You can test your token via curl:
    //   curl -X POST 'https://YOUR-SLACK-TEAM.slack.com/api/users.admin.invite' \
    //   --data 'email=EMAIL&token=TOKEN&set_active=true' \
    //   --compressed
    slacktoken: process.env.SLACK_TOKEN || 'YOUR-TOKEN-HERE',
    // an optional security measure - if it is set, then that token will be required to get invited.
    inviteToken: process.env.INVITE_TOKEN || null,

    locale: process.env.LOCALE || "en",

    // mongodb urls for databases
    // REPLACE DATABASE-NAME with dgwebsite or anything you want
    // Currently we aren't sharing databases so leaving it as is is probably fine as well
    db-test: process.env.DGWEBSITE_TEST             || 'mongodb://localhost/DATABASE-NAME-test',
    db-dev: process.env.DGWEBSITE_DEV               || 'mongodb://localhost/DATABASE-NAME-dev',
    db-production: process.env.DGWEBSITE_PRODUCTION || 'mongodb://localhost/DATABASE-NAME-production',
};