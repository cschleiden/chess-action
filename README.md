# GitHub Chess Action

*Disclaimer: this is one of those "because you can" projects. There are many, many more useful things you can do with GitHub Actions - but if you really, really want to it's flexible enough to let you play chess!*

Play chess in your GitHub repository. 

## Usage

Add the following workflow to one of your repositories:

```yml
name: Chess!

on: [push]

jobs:
  play:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v1
    - uses: cschleiden/chess-action@v1
      with:
        games: '["**/*.pgn"]'
        repo-token: ${{ secrets.GITHUB_TOKEN }}

    - name: Commit changed files
      uses: stefanzweifel/git-auto-commit-action@v2.3.0
      with:
        commit_message: Played some chess!
        branch: ${{ github.head_ref }}
        file_pattern: \*.pgn
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```


## Acknowledgements

This project makes use of some great libraries:
- https://github.com/jhlywa/chess.js - To parse, modify, and output PGN and FEN.
- https://github.com/nmrugg/stockfish.js - To actually play. 