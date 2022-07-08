import {context, getOctokit} from '@actions/github'
import {getBooleanInput, getInput, setFailed, setOutput} from '@actions/core'

async function run(): Promise<void> {
  try {
    const {
      repo,
      payload: {sender, issue, pull_request},
      issue: {number: issue_number}
    } = context

    // https://github.blog/changelog/2021-02-19-github-actions-workflows-triggered-by-dependabot-prs-will-run-with-read-only-permissions/
    if (sender?.login === 'dependabot[bot]') {
      console.log('Dependabot created the pull request, ending run.')
      return
    }

    const farthest = getBooleanInput('farthest')
    const overwrite = getBooleanInput('overwrite')
    const token = getInput('repo-token')
    const octokit = getOctokit(token)

    if (!overwrite && (issue?.milestone || pull_request?.milestone)) {
      console.log(
        'The `overwrite` option is not enabled and the issue or pull request already has a milestone, ending run.'
      )
      return
    }

    const {data: milestones} = await octokit.rest.issues.listMilestones({
      ...repo,
      state: 'open',
      sort: 'due_on',
      per_page: 100,
      direction: farthest ? 'desc' : 'asc'
    })

    if (!milestones.length) {
      console.log('There are no open milestones in this repo, ending run.')
      return
    }

    const currentDate = new Date(Date.now())
    currentDate.setUTCHours(0, 0, 0, 0)

    for (const milestone of milestones) {
      if (milestone.due_on && new Date(milestone.due_on) > currentDate) {
        await octokit.rest.issues.update({
          ...repo,
          issue_number,
          milestone: milestone.number
        })
        setOutput('milestone', milestone)
        return
      }
    }
    console.log('No matching milestone was found or added, ending run.')
  } catch (e) {
    if (e instanceof Error) {
      setFailed(e.message)
    }
  }
}

run()
