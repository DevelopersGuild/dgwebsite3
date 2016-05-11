// This node-schedule job should run every 24 hours
// and refresh repository information for each project
// in the database.

// rule.second     = second (0 - 59, OPTIONAL)
// rule.minute     = minute (0 - 59)
// rule.hour       = hour (0 - 23)
// rule.dayOfMonth = day of month (1 - 31)
// rule.month      = month (1 - 12)
// rule.dayOfWeek  = day of week (0 - 7) (0 or 7 is Sun)

var cron = require('node-schedule');

// Example to output to console every 5 seconds

// var rule = new cron.RecurrenceRule();
// rule.second = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

// cron.scheduleJob(rule, function(){
//     console.log(new Date(), 'The 30th second of the minute.');
// });

// Updates Github repositories every 24 hours at 12:00 AM

var updateRepos = new cron.RecurrenceRule();
updateRepos.dayOfWeek = [0, 1, 2, 3, 4, 5, 6];
updateRepos.hour = 0;
updateRepos.minute = 0;

// Function that actually calls the api and saves to database the updated information
cron.scheduleJob(updateRepos, function(){
    console.log('This runs at 12:00 AM every Everyday.');
});