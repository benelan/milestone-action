<p align="center">
  <a href="https://github.com/benelan/milestone-action/actions">
    <img
      alt="milestone-action status"
      src="https://github.com/benelan/milestone-action/actions/workflows/add-milestone-open.yml/badge.svg"
    />
  </a>
</p>

# Add Milestone By Due Date

This action adds the current milestone by due date, or the milestone with the
farthest due date to issues and pull requests. By default, the action ignores
closed milestones, milestones with no due date, and milestones that are past
due. This suits repos that have multiple open milestones with different due
dates, and a few milestones with no due dates (e.g. "backburner" and "stalled").

Alternatively, enable the `single` option if your repo only has one milestone
open at a time. When enabled, the only open milestone will be added to issues
and pull requests, even if it doesn't have a due date.

Here are successful test runs for [current](https://github.com/benelan/milestone-action/issues/8)
and [farthest](https://github.com/benelan/milestone-action/issues/16) due
milestones.

## Usage

```yaml
# .github/workflows/add-milestone.yml
name: Add Milestone
on:
  issues:
    types: [opened]
  pull_request:
    types: [closed]
    branches: [main]
jobs:
  add:
    runs-on: ubuntu-latest
    steps:
      - uses: benelan/milestone-action@v3
        with:
          # If true, add the milestone with the farthest due date. By default,
          # the action adds the current milestone (closest due date).
          farthest: false

          # If true, overwrite existing milestones on issues and pull requests.
          # By default, the action exits if a milestone has already been added.
          overwrite: false

          # If true, add the only open milestone in a repo, even if there is no
          # due date. By default, milestones with no due date are ignored.
          single: false
```

## Changelog

### [3.1.0](https://github.com/benelan/milestone-action/compare/v3.0.0...v3.1.0) (2024-02-10)

#### Features

- Add `single` option for repos that have one open milestone at a time with no
  due date.

### [3.0.0](https://github.com/benelan/milestone-action/compare/v2.0.0...v3.0.0) (2024-01-24)

#### Breaking Changes

- Upgrade the Node runner to `v20`, which is the current LTS version. Node `v16`
  reached [end of life](https://nodejs.org/en/blog/announcements/nodejs16-eol)
  on `2023-09-11` and the GitHub runner will be deprecated this year. See this
  [GitHub blog post](https://github.blog/changelog/2023-09-22-github-actions-transitioning-from-node-16-to-node-20/)
  for more info.
  ([e845696](https://github.com/benelan/milestone-action/commit/e845696b034a067c487b98502782a9c1a900edaf))

#### Features

- Use [GitHub Action annotations](https://github.com/actions/toolkit/tree/main/packages/core#annotations)
  instead of `console.log`
  ([4a7383b](https://github.com/benelan/milestone-action/commit/4a7383b3c7279110330e33a6a9762440556172e4))

### [2.0.0](https://github.com/benelan/milestone-action/compare/v1.3.1...v2.0.0) (2022-12-24)

#### Breaking Changes

- Upgrade the Node runner from the deprecated `v12` to `v16`. See this
  [GitHub blog post](https://github.blog/changelog/2022-09-22-github-actions-all-actions-will-begin-running-on-node16-instead-of-node12/)
  for more info
  ([f5f6fcb](https://github.com/benelan/milestone-action/commit/f5f6fcb16cecaa3255d2a9922838b027a9422dbb))

### [1.3.1](https://github.com/benelan/milestone-action/compare/v1.3.0...v1.3.1) (2022-04-26)

#### Fixes

- A milestone is considered current until the day after it is due date.
  Previously, it was considering the time of day the milestone was created when
  comparing the current date to the due date
  ([c68adeb](https://github.com/benelan/milestone-action/commit/c68adeb50cd9b0da6549310a7d8287aa70e2ac5f))

### [1.3.0](https://github.com/benelan/milestone-action/compare/v1.2.0...v1.3.0) (2022-04-26)

#### Features

- Add `overwrite` option to add the milestone even if one already exists on the
  issue or pull request
  ([7ad020e](https://github.com/benelan/milestone-action/commit/7ad020e55e306992345b0f58631515081a21d9e4))

### [1.2.0](https://github.com/benelan/milestone-action/compare/v1.1.1...v1.2.0) (2022-04-25)

#### Features

- Allow the workflow to run on any event action
  ([9bce688](https://github.com/benelan/milestone-action/commit/9bce688a0d578a791df9741db589a347e9a2b3a7))

### [1.1.1](https://github.com/benelan/milestone-action/compare/v1.1.0...v1.1.1) (2021-09-21)

#### Fixes

- Skip action when the sender is dependabot. See this
  [GitHub blog post](https://github.blog/changelog/2021-02-19-github-actions-workflows-triggered-by-dependabot-prs-will-run-with-read-only-permissions/)
  for more info
  ([e0a0717](https://github.com/benelan/milestone-action/commit/e0a0717993fa5615919e93f8ed5d2214eb742ac5))

### [1.1.0](https://github.com/benelan/milestone-action/compare/v1.0.0...v1.1.0) (2021-09-13)

#### Features

- Add `farthest` option to add the milestone with the farthest due date
  ([9ac638a](https://github.com/benelan/milestone-action/commit/9ac638af1d1e0642897aa740caf4435a6df5eebc))
