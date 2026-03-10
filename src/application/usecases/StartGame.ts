import type { Game } from "../models/Game";
import type { ImageUrlPort } from "../ports/ImageUrlPort";

export type StartGameInput =
  | { kind: "default" }
  | { kind: "upload"; file: File };

export class StartGame {
  private readonly imagePort: ImageUrlPort;

  constructor(imagePort: ImageUrlPort) {
    this.imagePort = imagePort;
  }

  execute(_input: StartGameInput): Game {
    throw new Error(`Not implemented yet : ${JSON.stringify(_input)} & ${JSON.stringify(this.imagePort)}`);
  }
}
