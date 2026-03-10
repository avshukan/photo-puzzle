import { afterEach, describe, expect, it, vi } from 'vitest';
import { applyMove, isSolved } from '../../domain';
import type { Game } from '../models/Game';
import { MoveTile } from './MoveTile';

vi.mock('../../domain', () => ({
  applyMove: vi.fn(),
  isSolved: vi.fn(),
}));

const baseGame: Game = {
  imageUrl: 'img',
  puzzle: { width: 2, height: 2, tiles: [1, 2, 3, 0] },
  status: 'playing',
};

afterEach(() => {
  vi.resetAllMocks();
});

describe('MoveTile', () => {
  it('returns the same game when already won', () => {
    const game: Game = { ...baseGame, status: 'won' };
    const usecase = new MoveTile();

    const result = usecase.execute(game, 0);

    expect(result).toBe(game);
    expect(applyMove).not.toHaveBeenCalled();
    expect(isSolved).not.toHaveBeenCalled();
  });

  it('applies a move and keeps playing when not solved', () => {
    const nextPuzzle = { width: 2, height: 2, tiles: [1, 2, 0, 3] } as const;
    (applyMove as ReturnType<typeof vi.fn>).mockReturnValue(nextPuzzle);
    (isSolved as ReturnType<typeof vi.fn>).mockReturnValue(false);
    const usecase = new MoveTile();

    const result = usecase.execute(baseGame, 2);

    expect(applyMove).toHaveBeenCalledWith(baseGame.puzzle, 2);
    expect(isSolved).toHaveBeenCalledWith(nextPuzzle);
    expect(result.puzzle).toBe(nextPuzzle);
    expect(result.status).toBe('playing');
  });

  it('applies a move and marks the game as won when solved', () => {
    const nextPuzzle = { width: 2, height: 2, tiles: [1, 2, 3, 0] } as const;
    (applyMove as ReturnType<typeof vi.fn>).mockReturnValue(nextPuzzle);
    (isSolved as ReturnType<typeof vi.fn>).mockReturnValue(true);
    const usecase = new MoveTile();

    const result = usecase.execute(baseGame, 1);

    expect(applyMove).toHaveBeenCalledWith(baseGame.puzzle, 1);
    expect(isSolved).toHaveBeenCalledWith(nextPuzzle);
    expect(result.status).toBe('won');
    expect(result.puzzle).toBe(nextPuzzle);
  });
});
