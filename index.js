const probot = require('probot')
const createScheduler = require('probot-scheduler')
const emptyGitHubCommit = require('make-empty-github-commit')

module.exports = robot => {
  // Once every 3 seconds for testing
  const interval = 3 * 1000 // 60*60*1000 is default, and is for an hour

  scheduler = createScheduler(robot, {'interval': interval});

  robot.on('schedule.repository', context => {
    // this event is triggered on an interval, which is 1 hr by default;

    // Find out what branch Pages updates off by getting the Pages information
    return context.github.repos.getPages({
      owner: 'RichardLitt',
      repo: '2117.91USD',
      // Shouldn't need these, as they're in https://github.com/octokit/rest.js/blob/master/lib/routes.json#L8562
      headers: {
        accept: 'application/vnd.github.mister-fantastic-preview+json'
      }
    }).then(response => {

      // Then, get that branch so that you can reference the commits on it
      return context.github.repos.getBranch({
        owner: 'RichardLitt',
        repo: '2117.91USD',
        branch: response.data.source.branch // branch
      }).then(pagesBranch => {

        robot.log(response.data.source.branch)

        return emptyGitHubCommit({
          owner: 'RichardLitt',
          repo: '2117.91USD',
          // token: process.env.TOKEN,
          message: 'chore: empty commit to force build',
          branch: 'master' //response.data.source.branch
        }).then(console.log, e => {
          console.error(e)
          process.exit(1)
        })

        // Create a new blob so you can create a new commit
        // return context.github.repos.createBlob({
        //   owner: 'RichardLitt',
        //   repo: '2117.91USD',
        //   content: '',
        //   encoding: 'utf-8'
        // }).then(blob => {
        //   robot.log(`blob`, blob)
        //
        //   // Create a new commit
        //   return context.github.gitdata.createCommit({
        //     owner: 'RichardLitt',
        //     repo: '2117.91USD',
        //     message: 'chore: empty commit to force build',
        //     tree: blob.data.sha, // This shouldn't be the parents, but a new SHA. pagesBranch.data.commit.commit.tree.sha, // Sha of tree,
        //     parents: pagesBranch.data.parents // Array of the parents
        //     // committer: 'Probot Jekyll Scheduler'
        //   }).then(res => robot.log(res))
        // })
      })
    })
  })

}
