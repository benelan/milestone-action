# Add Milestone By Due Date

This action adds the current or farthest due milestone to issues and pull requests. The current milestone is the one due the soonest, excluding milestones that are past due, based on the datetime that the action is run. Here are successful test runs for [current](https://github.com/benelan/milestone-action/issues/8) and [farthest](https://github.com/benelan/milestone-action/issues/16) due milestones.


## Usage
```yaml
# .github/workflows/add-milestone.yml
name: Add Milestone
on:
  issues:
    types: [opened]
    branches: [master]
  pull_request:
    types: [opened]
    branches: [master]
jobs:
  add:
    runs-on: ubuntu-latest
    steps:
      - uses: benelan/milestone-action@v1.0.1
        with:
          farthest: true # remove this line to add the current milestone
```
