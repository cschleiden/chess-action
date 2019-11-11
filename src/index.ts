import * as core from "@actions/core";
import { promises as fs } from "fs";
import { Game } from "./game";
import { play } from "./play";
import glob from "tiny-glob";

async function run() {
  // Read inputs
  const gamesGlob = core.getInput("games") || "**/*.pgn";
  const timeToThink = parseInt(core.getInput("timeToThink") || "", 10) || 1000;

  // Perform moves
  const games = await glob(gamesGlob);
  for (const game of games) {
    const file = await fs.readFile(game, "utf-8");
    const g = new Game(file);
    const move = await play(g, timeToThink);
    g.move(move);
    await fs.writeFile(game, g.output, "utf-8");
  }
}

run();
