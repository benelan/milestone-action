<p align="center">
  <a href="https://github.com/benelan/milestone-action/actions"><img alt="milestone-action status" src="https://github.com/benelan/milestone-action/actions/workflows/add-milestone-open.yml/badge.svg"></a>
</p>

# Add Milestone By Due Date

This Action adds the current milestone or the milestone with the farthest due date to issues and pull requests. The Action ignores closed milestones, milestones with no due date, and milestones that are past due. Here are successful test runs for [current](https://github.com/benelan/milestone-action/issues/8) and [farthest](https://github.com/benelan/milestone-action/issues/16) due milestones.

## Usage

```yaml
# .github/workflows/add-milestone.yml
name: Add Milestone
on:
  issues:
    types: [opened]
    branches: [master]
  pull_request:
    types: [closed]
    branches: [master]
jobs:
  add:
    runs-on: ubuntu-latest
    steps:
      - uses: benelan/milestone-action@v2
        with:
          farthest: true # remove this line to add the current milestone
          overwrite: true # remove this line to keep an existing milestone
```

## Changelog

### [2.0.0](https://github.com/benelan/milestone-action/compare/v1.3.1...v2.0.0) (2022-12-24)

#### Breaking Changes

Upgraded the Node runner from the deprecated `v12` to `v16`. See this [GitHub blog post](https://github.blog/changelog/2022-09-22-github-actions-all-actions-will-begin-running-on-node16-instead-of-node12/) for more info.

### [1.3.1](https://github.com/benelan/milestone-action/compare/v1.3.0...v1.3.1) (2022-04-26)

#### Fixes

- A milestone is considered current until the day after its due date. Previously it was considering the time of day when comparing the current date to a milestone's due date. ([c68adeb](https://github.com/benelan/milestone-action/commit/c68adeb50cd9b0da6549310a7d8287aa70e2ac5f))

### [1.3.0](https://github.com/benelan/milestone-action/compare/v1.2.0...v1.3.0) (2022-04-26)

#### Features

- Add option to overwrite an existing milestone ([7ad020e](https://github.com/benelan/milestone-action/commit/7ad020e55e306992345b0f58631515081a21d9e4))

### [1.2.0](https://github.com/benelan/milestone-action/compare/v1.1.1...v1.2.0) (2022-04-25)

#### Features

- Allow the workflow to run on any event action ([9bce688](https://github.com/benelan/milestone-action/commit/9bce688a0d578a791df9741db589a347e9a2b3a7))

### [1.1.1](https://github.com/benelan/milestone-action/compare/v1.1.0...v1.1.1) (2021-09-21)

#### Fixes

- skip action when the sender is dependabot, read this [blog post](https://github.blog/changelog/2021-02-19-github-actions-workflows-triggered-by-dependabot-prs-will-run-with-read-only-permissions/) for more info ([e0a0717](https://github.com/benelan/milestone-action/commit/e0a0717993fa5615919e93f8ed5d2214eb742ac5))

### [1.1.0](https://github.com/benelan/milestone-action/compare/v1.0.0...v1.1.0) (2021-09-13)

#### Features

- add option to use the milestone with the farthest due date ([9ac638a](https://github.com/benelan/milestone-action/commit/9ac638af1d1e0642897aa740caf4435a6df5eebc))
