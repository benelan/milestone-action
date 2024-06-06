import { context, getOctokit } from "@actions/github";
import type { GetResponseDataTypeFromEndpointMethod } from "@octokit/types";
import {
  getBooleanInput,
  getInput,
  setFailed,
  setOutput,
  notice,
  warning,
} from "@actions/core";
import { determineMilestone } from "./utils";

const farthest = getBooleanInput("farthest");
const overwrite = getBooleanInput("overwrite");
const single = getBooleanInput("single");

const token = getInput("repo-token");
const octokit = getOctokit(token);

export type Milestones = GetResponseDataTypeFromEndpointMethod<
  typeof octokit.rest.issues.listMilestones
>;

export type Milestone = Milestones[0];

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

    if (!overwrite && (issue?.milestone || pull_request?.milestone)) {
      notice(
        "Exit: the `overwrite` option is not enabled and the issue or pull request already has a milestone.",
      );
      process.exit(0);
    }

    const response = await octokit.rest.issues.listMilestones({
      ...repo,
      state: "open",
      sort: "due_on",
      per_page: 100,
      direction: farthest ? "desc" : "asc",
    });

    const milestones: Milestones = response.data;

    const milestone: Milestone | undefined = determineMilestone(
      milestones,
      single,
    );

    if (!milestone) {
      warning(
        "Exit: all milestones are closed, past due, or don't have a due date.",
      );
    } else {
      await octokit.rest.issues.update({
        ...repo,
        issue_number,
        milestone: milestone?.number,
      });

      notice(
        `Success: the issue or pull request was added to the "${milestone?.title}" milestone.`,
      );

      setOutput("milestone", milestone);
    }

    process.exit(0);
  } catch (e) {
    if (e instanceof Error) {
      setFailed(e.message);
      process.exit(1);
    }
  }
}
