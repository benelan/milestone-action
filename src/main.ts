import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    const {repo, payload, issue} = github.context

    if (payload.action !== 'opened') {
      console.log('No issue or pull request was opened, skipping')
      return
    }

    if (!payload.issue && !payload.pull_request) {
      console.log(
        'The event that triggered this action was not a pull request or issue, skipping.'
      )
      return
    }

    if (!!payload.issue?.milestone || !!payload.pull_request?.milestone) {
      console.log(
        'The issue or pull request already has a milestone, skipping.'
      )
      return
    }

    const farthest = core.getBooleanInput('farthest')
    const myToken = core.getInput('github_token')
    const client = github.getOctokit(myToken)

    const milestones = await client.rest.issues.listMilestones({
      ...repo,
      state: 'open',
      sort: 'due_on',
      direction: farthest ? 'desc' : 'asc'
    })

    if (milestones.data.length === 0) {
      console.log('There are no open milestones in this repo, skipping.')
      return
    }

    const currentDate = new Date()

    for (const milestone of milestones.data) {
      if (milestone.due_on && new Date(milestone.due_on) > currentDate) {
        await client.rest.issues.update({
          ...repo,
          issue_number: issue.number,
          milestone: milestone.number
        })
        core.setOutput('milestone', milestone)
        return
      }
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      core.setFailed(e.message)
    }
  }
}

run()
