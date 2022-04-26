<p align="center">
  <a href="https://github.com/actions/milestone-action/actions"><img alt="milestone-action status" src="https://github.com/benelan/milestone-action/actions/workflows/test.yml/badge.svg"></a>
</p>

# Add Milestone By Due Date

This Action adds the current milestone or the milestone with the farthest due date to issues and pull requests. The Action ignores milestones that are past due, as well as milestones with no due date. Here are successful test runs for [current](https://github.com/benelan/milestone-action/issues/8) and [farthest](https://github.com/benelan/milestone-action/issues/16) due milestones.


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
      - uses: benelan/milestone-action@v1.2.0
        with:
          farthest: true # remove this line to add the current milestone
```


## Changelog
### [1.2.0](https://github.com/benelan/milestone-action/compare/v1.1.1...v1.2.0) (2021-09-21)

#### Features

- Allow the workflow to run on any event action ([9bce688](https://github.com/benelan/milestone-action/commit/9bce688a0d578a791df9741db589a347e9a2b3a7))

### [1.1.1](https://github.com/benelan/milestone-action/compare/v1.1.0...v1.1.1) (2021-09-21)

#### Bug Fixes

* skip action when the sender is dependabot, read this [blog post](https://github.blog/changelog/2021-02-19-github-actions-workflows-triggered-by-dependabot-prs-will-run-with-read-only-permissions/) for more info ([e0a0717](https://github.com/benelan/milestone-action/commit/e0a0717993fa5615919e93f8ed5d2214eb742ac5))

### [1.1.0](https://github.com/benelan/milestone-action/compare/v1.0.0...v1.1.0) (2021-09-13)

#### Features

- add option to use the milestone with the farthest due date ([9ac638a](https://github.com/benelan/milestone-action/commit/9ac638af1d1e0642897aa740caf4435a6df5eebc))
