import { describe, expect, it } from 'vitest';
import type { PuzzleState } from '../entities/PuzzleState';
import { applyMove, canMove, createSolved, isSolved } from './puzzleRules';

describe('createSolved', () => {
  it('builds a solved state with the empty tile last', () => {
    const state = createSolved(3, 3);

    expect(state.width).toBe(3);
    expect(state.height).toBe(3);
    expect(state.tiles).toHaveLength(9);
    expect(state.tiles[8]).toBe(0);
    expect(isSolved(state)).toBe(true);
  });
});

describe('isSolved', () => {
  it('detects a solved puzzle', () => {
    const state = createSolved(2, 2);

    expect(isSolved(state)).toBe(true);
  });

  it('rejects puzzles with incorrect length', () => {
    const invalid: PuzzleState = {
      width: 2,
      height: 2,
      tiles: [1, 2, 3, 0, 4],
    };

    expect(isSolved(invalid)).toBe(false);
  });

  it('rejects puzzles with misplaced tiles', () => {
    const invalid: PuzzleState = {
      width: 2,
      height: 2,
      tiles: [1, 2, 0, 3],
    };

    expect(isSolved(invalid)).toBe(false);
  });
});

describe('canMove', () => {
  it('allows moving a tile adjacent to the empty space', () => {
    const state = createSolved(3, 3);

    expect(canMove(state, 7)).toBe(true);
  });

  it('disallows diagonal moves', () => {
    const state: PuzzleState = {
      width: 3,
      height: 3,
      tiles: [1, 2, 3, 4, 5, 6, 0, 7, 8],
    };

    expect(canMove(state, 8)).toBe(false);
  });

  it('disallows moves when no empty tile is present', () => {
    const state: PuzzleState = {
      width: 2,
      height: 2,
      tiles: [1, 2, 3, 4],
    };

    expect(canMove(state, 0)).toBe(false);
  });

  it('disallows moves from out-of-range positions', () => {
    const state = createSolved(2, 2);

    expect(canMove(state, -1)).toBe(false);
    expect(canMove(state, 4)).toBe(false);
  });

  it('disallows moves from the empty tile position', () => {
    const state = createSolved(2, 2);

    expect(canMove(state, 3)).toBe(false);
  });
});

describe('applyMove', () => {
  it('swaps the tile with the empty space when the move is valid', () => {
    const state = createSolved(3, 3);

    const next = applyMove(state, 7);

    expect(next).not.toBe(state);
    expect(next.tiles[7]).toBe(0);
    expect(next.tiles[8]).toBe(8);
    expect(isSolved(next)).toBe(false);
  });

  it('returns the original state when the move is invalid', () => {
    const state = createSolved(2, 2);

    const next = applyMove(state, 0);

    expect(next).toBe(state);
    expect(next.tiles).toBe(state.tiles);
  });
});
