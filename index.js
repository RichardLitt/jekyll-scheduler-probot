const probot = require('probot')
const createScheduler = require('probot-scheduler');

module.exports = robot => {
  // Once every 30 seconds for testing
  const interval = 30*1000 // 60*60*1000 is default, and is for an hour

  scheduler = createScheduler(robot, {'interval': interval});

  robot.on('schedule.repository', context => {
    // this event is triggered on an interval, which is 1 hr by default;
    return context.github.requestPageBuild({
      owner: 'RichardLitt',
      repo: '2117.91USD',
      // Shouldn't need these, as they're in https://github.com/octokit/rest.js/blob/master/lib/routes.json#L8562
      // headers: {
      //   accept: 'application/vnd.github.mister-fantastic-preview+json'
      // }
    })
  })

}
