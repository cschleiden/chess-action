import { promises as fs, write } from "fs";
import { join } from "path";
import { main } from "./index";
import * as process from "process";
import del from "del";

const gameFolder = "./_test_games";

async function writeGame(fileName: string, content: string): Promise<void> {
  await fs.writeFile(join(gameFolder, fileName), content, "utf-8");
}

function readGame(fileName: string): Promise<string> {
  return fs.readFile(join(gameFolder, fileName), "utf-8");
}

describe("basic functionality - e2e", () => {
  let output = "";

  beforeEach(async () => {
    try {
      await fs.mkdir(gameFolder, {
        recursive: true
      });
    } catch {
      // Ignore error here
    }

    process.stdout.write = jest.fn((input: string) => {
      output = input;
      return true;
    });
  });

  afterEach(async () => {
    await del(gameFolder);
  });

  test("engine makes first move", async () => {
    await writeGame("game1.pgn", "1. e4");

    await main(join(gameFolder, "game1.pgn"), 1000);

    expect(await readGame("game1.pgn")).toBe(
      `1. e4 e5

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
}`
    );
  });

  test("handles end of game", async () => {
    await writeGame(
      "game1.pgn",
      `[SetUp "1"]
[FEN "r3k2r/ppp2p1p/2n1p1p1/7n/2B4q/2NPbP2/PP4PP/R2Q3K w kq - 0 1"]

1. f4 Ng3#`
    );

    await main(join(gameFolder, "game1.pgn"), 1000);

    expect(output).toMatch(/game already ended/);
  });
});
