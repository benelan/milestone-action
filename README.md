# Add Milestone By Due Date

This action adds a the current milestone to an issue or pull request. It chooses the milestone that expires soonest, excluding those that already expired, based on the datetime that the action is run. You can see a successful test run [here](https://github.com/benelan/milestone-action/issues/8).


## Usage
```yml
# .github/workflows/add-milestone.yml
name: Add Milestone
issues:
    types: [opened]
    branches: [ master ]
  pull_request:
    types: [opened]
    branches: [ master ]
jobs:
  add:
    runs-on: ubuntu-latest
    steps:
      - uses: benelan/milestone-action@v1.0.0
        with:
          github_token: "${{ secrets.GITHUB_TOKEN }}"
```
