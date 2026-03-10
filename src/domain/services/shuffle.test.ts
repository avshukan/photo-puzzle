import { describe, expect, it, vi } from 'vitest';
import { shuffleFromSolved } from './shuffle';
import { isSolved } from './puzzleRules';

const restoreRandom = (spy: ReturnType<typeof vi.spyOn>) => spy.mockRestore();

describe('shuffleFromSolved', () => {
  it('produces a deterministic shuffle when Math.random is mocked', () => {
    const randomSpy = vi.spyOn(Math, 'random').mockImplementation(() => 0);

    const state = shuffleFromSolved(3, 3, 2);

    restoreRandom(randomSpy);

    expect(state.tiles).toEqual([1, 2, 0, 4, 5, 3, 7, 8, 6]);
    expect(isSolved(state)).toBe(false);
  });

  it('retains all tiles and uses the requested number of steps', () => {
    const steps = 5;
    const randomSpy = vi.spyOn(Math, 'random').mockImplementation(() => 0.5);

    const state = shuffleFromSolved(2, 2, steps);

    expect(randomSpy).toHaveBeenCalledTimes(steps);
    restoreRandom(randomSpy);

    const tiles = [...state.tiles].sort((a, b) => a - b);
    expect(tiles).toEqual([0, 1, 2, 3]);
    expect(state.tiles).toHaveLength(4);
  });

  it('covers neighbor calculation when the empty tile sits on the top row', () => {
    const randomSpy = vi
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.75);

    const state = shuffleFromSolved(2, 2, 2);

    expect(randomSpy).toHaveBeenCalledTimes(2);
    expect(state.tiles).toEqual([0, 1, 3, 2]);
    expect(isSolved(state)).toBe(false);

    restoreRandom(randomSpy);
  });
});
