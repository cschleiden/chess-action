import { Game } from "./game";
import { delay } from "./util";
import stockfish from "stockfish";

enum State {
  UCI,
  UCIOK,
  THINKING
}

export async function play(
  game: Game,
  timeToThinkInMs = 1000
): Promise<string> {
  return new Promise(resolve => {
    const engine = stockfish();

    let state = State.UCI;

    engine.onmessage = async (line: string) => {
      // console.debug("Line: " + line);

      if (typeof line !== "string") {
        throw new Error(`Unhandled response ${line}`);
      }

      switch (state) {
        case State.UCI:
          if (line === "uciok") {
            engine.postMessage(`position fen ${game.fen}`);
            engine.postMessage(`eval`);
            engine.postMessage(`d`);
            engine.postMessage(`go ponder`);

            state = State.UCIOK;
          }
          break;

        case State.UCIOK:
          if (line.indexOf("info depth") > -1) {
            state = State.THINKING;
            await delay(timeToThinkInMs);
            engine.postMessage("stop");
          }
          break;

        case State.THINKING:
          if (line.indexOf("bestmove") > -1) {
            const match = line.match(/bestmove\s+(\S+)/);
            if (match) {
              const bestMove = match[1];
              resolve(bestMove);
            }
          }
          break;
      }
    };

    engine.postMessage("uci");
  });
}
