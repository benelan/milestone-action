import { Milestone, Milestones } from "./main";

/**
 * Determine which milestone should be added to the issue or pull request.
 * @param milestones The list of open milestones
 * @returns The first milestone in the list that has a due date in the future
 */
export function determineMilestone(
  milestones: Milestones,
  single: boolean,
): Milestone | undefined {
  if (!milestones.length) {
    return;
  }

  if (single && milestones.length === 1) {
    return milestones[0];
  }

  const currentDate = new Date(Date.now());
  currentDate.setUTCHours(0, 0, 0, 0);

  for (const milestone of milestones) {
    if (milestone.due_on && new Date(milestone.due_on) > currentDate) {
      return milestone;
    }
  }
}
