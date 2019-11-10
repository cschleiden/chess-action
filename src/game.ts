import { Chess } from "chess.js";

export class Game {
  private c = new Chess();

  constructor(pgn: string) {
    this.c.load_pgn(pgn);

    this.c.moves().forEach(m => console.log(m));
  }

  get fen(): string {
    return this.c.fen();
  }

  get pgn(): string {
    return this.c.pgn({
      max_width: 5
    });
  }

  get output(): string {
    return `${this.pgn}\n\n{\n${this.c.ascii()}}`;
  }

  move(move: string): void {
    if (
      !this.c.move(move, {
        sloppy: true
      })
    ) {
      throw new Error("Cannot make move");
    }
  }
}
