import { context, getOctokit } from "@actions/github";
import {
  getBooleanInput,
  getInput,
  setFailed,
  setOutput,
  notice,
  warning,
} from "@actions/core";

export async function run(): Promise<void> {
  try {
    const {
      repo,
      payload: { sender, issue, pull_request },
      issue: { number: issue_number },
    } = context;

    // https://github.blog/changelog/2021-02-19-github-actions-workflows-triggered-by-dependabot-prs-will-run-with-read-only-permissions/
    if (sender?.login === "dependabot[bot]") {
      notice("Exit: dependabot created the pull request.");
      process.exit(0);
    }

    const farthest = getBooleanInput("farthest");
    const overwrite = getBooleanInput("overwrite");

    const token = getInput("repo-token");
    const octokit = getOctokit(token);

    if (!overwrite && (issue?.milestone || pull_request?.milestone)) {
      notice(
        "Exit: the `overwrite` option is not enabled and the issue or pull request already has a milestone.",
      );
      process.exit(0);
    }

    const { data: milestones } = await octokit.rest.issues.listMilestones({
      ...repo,
      state: "open",
      sort: "due_on",
      per_page: 100,
      direction: farthest ? "desc" : "asc",
    });

    if (!milestones.length) {
      warning("Exit: there are no open milestones in this repo.");
      process.exit(0);
    }

    const currentDate = new Date(Date.now());
    currentDate.setUTCHours(0, 0, 0, 0);

    for (const milestone of milestones) {
      if (milestone.due_on && new Date(milestone.due_on) > currentDate) {
        await octokit.rest.issues.update({
          ...repo,
          issue_number,
          milestone: milestone.number,
        });

        notice(
          `Success: the issue or pull request was added to the "${milestone.title}" milestone.`,
        );

        setOutput("milestone", milestone);
        process.exit(0);
      }
    }

    notice("Exit: all open milestones are past due or do not have a due date.");
  } catch (e) {
    if (e instanceof Error) {
      setFailed(e.message);
      process.exit(1);
    }
  }
}
