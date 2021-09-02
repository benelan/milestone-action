import * as core from '@actions/core'
import * as github from '@actions/github'
import {WebhookPayload} from '@actions/github/lib/interfaces'

interface Payload extends WebhookPayload {
  pull_request?: {
    [key: string]: unknown
    number: number
    html_url?: string
    body?: string
    milestone?: unknown
  }
  issue?: {
    [key: string]: unknown
    number: number
    html_url?: string
    body?: string
    milestone?: unknown
  }
}

export const existsMilestone = (payload: Payload): boolean =>
  !!(payload.issue?.milestone || payload.pull_request?.milestone)

interface Milestone {
  title: string
  number: number
  due_on: string | null
}

export const findCurrentMilestone = (milestones: {
  data: Milestone[]
}): Milestone => {
  return milestones.data[0]
}

async function run(): Promise<void> {
  const {repo, payload, issue} = github.context

  if (payload.action !== 'opened') {
    console.log('No issue or PR was opened, skipping')
    return
  }

  // Do nothing if its not a pr or issue
  const isIssue = !!payload.issue
  const isPR = !!payload.pull_request
  if (!isIssue && !isPR) {
    console.log(
      'The event that triggered this action was not a pull request or issue, skipping.'
    )
    return
  }

  if (existsMilestone(payload as Payload)) {
    console.log('Milestone already exist, skipping.')
    return
  }

  const myToken = core.getInput('github_token')
  const client = github.getOctokit(myToken)

  const milestones = await client.rest.issues.listMilestones({
    ...repo,
    state: 'open',
    sort: 'due_on',
    direction: 'asc'
  })

  if (milestones.data.length === 0) {
    console.log('There are no milestones, skipping.')
    return
  }

  const currentMilestone = findCurrentMilestone(milestones)

  await client.rest.issues.update({
    ...repo,
    issue_number: issue.number,
    milestone: currentMilestone.number
  })
  core.setOutput('milestone', currentMilestone)
}

// eslint-disable-next-line github/no-then
run().catch(err => {
  core.setFailed(err.message)
})
