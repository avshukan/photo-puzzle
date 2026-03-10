import type { PuzzleState } from '../entities/PuzzleState';

export function createSolved(width: number, height: number): PuzzleState {
  throw new Error(`Not implemented (width=${width}, height=${height})`);
}

export function isSolved(state: PuzzleState): boolean {
  throw new Error(`Not implemented (state=${JSON.stringify(state)})`);
}

export function canMove(state: PuzzleState, fromIndex: number): boolean {
  throw new Error(
    `Not implemented (state=${JSON.stringify(state)}, fromIndex=${fromIndex})`,
  );
}

export function applyMove(state: PuzzleState, fromIndex: number): PuzzleState {
  throw new Error(
    `Not implemented (state=${JSON.stringify(state)}, fromIndex=${fromIndex})`,
  );
}
