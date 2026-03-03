import type { Game } from "../models/Game";

export class MoveTile {
  execute(_game: Game, _fromIndex: number): Game {
    throw new Error(`Not implemented yet : ${JSON.stringify(_game)} & ${JSON.stringify(_fromIndex)}`);
  }
}
