'use strict'

// duplicate this file and rename it "config.js" without quotes and fill in the params
// your github api client id
//    YOUR-CLIENT-ID-HERE
// your github api secret id
//    YOUR-CLIENT-SECRET-HERE
// Your slack invite token
//    YOUR-TOKEN-HERE
//    
// REPLACE DATABASE-NAME with dgwebsite or anything you want

module.exports={
  githubClientParams: '?client_id=6b8b5cc27df6484a26a0&client_secret=4e5ade6a17b233b5b4674c5459fe7fcdc89b64cc',
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
  slacktoken: process.env.SLACK_TOKEN || 'xoxp-4908454559-4906624468-42880488148-68d38ac994',
  // an optional security measure - if it is set, then that token will be required to get invited.
  inviteToken: process.env.INVITE_TOKEN || null,
  locale: process.env.LOCALE || "en",

  // mongodb urls for databases
  // REPLACE DATABASE-NAME with dgwebsite or anything you want
  // Currently we aren't sharing databases so leaving it as is is probably fine as well
  dbTest: process.env.DGWEBSITE_TEST             || 'mongodb://localhost/dgwebsite-db-test',
  dbDevelopment:  process.env.DGWEBSITE_DEV      || 'mongodb://localhost/dgwebsite-db-dev',
  dbProduction: process.env.DGWEBSITE_PRODUCTION || 'mongodb://localhost/dgwebsite-db-production',
};
