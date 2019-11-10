# GitHub Actions Chess

*Disclaimer: this is one of those "because you can" projects. There are many, many more useful things you can do with GitHub Actions - but if you really, really want to it's flexible enough to even let you play chess!*

Play chess in your GitHub repository. Create as many concurrent games as you want and play chess without ever leaving your favorite IDE.

## Usage

Add the following workflow to one of your repositories, as `.github/workflows/chess.yaml`:

```yml
name: Chess!

on:
  push:
    paths:
      - '**.pgn'

jobs:
  play:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v1

    - uses: cschleiden/chess-action@v1
      with:
        games: '**/*.pgn'

    - name: Commit changed files
      uses: stefanzweifel/git-auto-commit-action@v2.3.0
      with:
        commit_message: Played some chess!
        branch: master
        file_pattern: '*.pgn'
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
<details>
<summary>
Workflow details
</summary>
This workflow will: 

- on every push that includes a `*.pgn` file anywhere in the repository:
- checkout your repository
- play a move on every game represented by a `.pgn` file anywhere in the repository
- commit and push the updated game states back to your repository (*note: for new the source branch needs to be hard-coded, since `actions/checkout` leaves the checked out repository in a DETACHED state*)
</details>

Then, create a file like `game1.pgn` anywhere in your repository and enter your first move in [Portable Game Notation](https://en.wikipedia.org/wiki/Portable_Game_Notation), for example:

```pgn
1. e4
```

Let's commit and push. 

```bash
$ git add game1.pgn
$ git commit -m "My first move"
$ git push
```

Now, the action will run, read the game, make its move and commit the result back to the branch. So after a bit of time, let's pull:

```bash
$ git pull
```

And refresh our `game1.pgn`:

```pgn
1. e4 e5

{
   +------------------------+
 8 | r  n  b  q  k  b  n  r |
 7 | p  p  p  p  .  p  p  p |
 6 | .  .  .  .  .  .  .  . |
 5 | .  .  .  .  p  .  .  . |
 4 | .  .  .  .  P  .  .  . |
 3 | .  .  .  .  .  .  .  . |
 2 | P  P  P  P  .  P  P  P |
 1 | R  N  B  Q  K  B  N  R |
   +------------------------+
     a  b  c  d  e  f  g  h
}
```

The action has moved its pawn to e5 and for our convenience added a nice ASCII diagram of the current state of the board.

To add our next move,  just modify the file again, commit, push, etc.. 

## Known issues

The way the workflow is defined, it will always read all game files (default `**.pgn`) and play the next move, so if you have multiple concurrent 

Also, this pretty much uses some default `stockfish` settings, I'm not really familiar with [UCI](https://en.wikipedia.org/wiki/Universal_Chess_Interface) engines, so there's probably room for improvement :).

## Acknowledgements

This project makes use of some great libraries:
- https://github.com/jhlywa/chess.js - To parse, modify, and output PGN and FEN.
- https://github.com/nmrugg/stockfish.js - To actually play. 