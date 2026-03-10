import type { PuzzleState } from '../entities/PuzzleState';
import { applyMove, createSolved } from './puzzleRules';

export function shuffleFromSolved(
  width: number,
  height: number,
  steps: number = 300,
): PuzzleState {
  let state = createSolved(width, height);

  for (let i = 0; i < steps; i++) {
    const emptyIndex = state.tiles.indexOf(0);
    const neighborIndexes = getNeighborIndexes(
      emptyIndex,
      state.width,
      state.height,
    );

    const randomIndex = Math.floor(Math.random() * neighborIndexes.length);
    const fromIndex = neighborIndexes[randomIndex];

    state = applyMove(state, fromIndex);
  }

  return state;
}

function getNeighborIndexes(
  index: number,
  width: number,
  height: number,
): number[] {
  const row = Math.floor(index / width);
  const col = index % width;

  const neighbors: number[] = [];

  if (row > 0) {
    neighbors.push(index - width);
  }

  if (row < height - 1) {
    neighbors.push(index + width);
  }

  if (col > 0) {
    neighbors.push(index - 1);
  }

  if (col < width - 1) {
    neighbors.push(index + 1);
  }

  return neighbors;
}
