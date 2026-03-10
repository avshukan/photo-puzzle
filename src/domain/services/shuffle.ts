import type { PuzzleState } from "../entities/PuzzleState";

export function shuffleFromSolved(
  width: number,
  height: number,
  steps: number = 300
): PuzzleState {
  throw new Error(`Not implemented (width=${width}, height=${height}, steps=${steps})`);
}
