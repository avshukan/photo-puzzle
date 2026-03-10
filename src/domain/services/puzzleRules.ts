import type { PuzzleState } from '../entities/PuzzleState';

export function createSolved(width: number, height: number): PuzzleState {
  const total = width * height;

  const tiles = Array.from({ length: total }, (_, index) =>
    index === total - 1 ? 0 : index + 1,
  );

  return {
    width,
    height,
    tiles,
  };
}

export function isSolved(state: PuzzleState): boolean {
  const { width, height, tiles } = state;
  const total = width * height;

  if (tiles.length !== total) {
    return false;
  }

  for (let i = 0; i < total; i++) {
    const expected = i === total - 1 ? 0 : i + 1;

    if (tiles[i] !== expected) {
      return false;
    }
  }

  return true;
}

export function canMove(state: PuzzleState, fromIndex: number): boolean {
  const { width, height, tiles } = state;
  const total = width * height;

  if (fromIndex < 0 || fromIndex >= total) {
    return false;
  }

  const emptyIndex = tiles.indexOf(0);

  if (emptyIndex === -1) {
    return false;
  }

  if (fromIndex === emptyIndex) {
    return false;
  }

  const fromRow = Math.floor(fromIndex / width);
  const fromCol = fromIndex % width;

  const emptyRow = Math.floor(emptyIndex / width);
  const emptyCol = emptyIndex % width;

  const distance = Math.abs(fromRow - emptyRow) + Math.abs(fromCol - emptyCol);

  return distance === 1;
}

export function applyMove(state: PuzzleState, fromIndex: number): PuzzleState {
  if (!canMove(state, fromIndex)) {
    return state;
  }

  const emptyIndex = state.tiles.indexOf(0);
  const nextTiles = [...state.tiles];

  [nextTiles[fromIndex], nextTiles[emptyIndex]] = [
    nextTiles[emptyIndex],
    nextTiles[fromIndex],
  ];

  return {
    ...state,
    tiles: nextTiles,
  };
}
