import { describe, expect, it, vi } from 'vitest';
import type { PuzzleState } from '../../domain';
import * as domain from '../../domain';
import { StartGame } from './StartGame';

const puzzleMock: PuzzleState = {
  width: 4,
  height: 4,
  tiles: Array.from({ length: 16 }, (_, i) => (i === 15 ? 0 : i + 1)),
};

describe('StartGame', () => {
  it('starts a default game using the default image and shuffled puzzle', () => {
    const imagePort = {
      getDefaultImageUrl: vi.fn().mockReturnValue('default-url'),
      readAsDataUrl: vi.fn(),
    };

    const shuffleSpy = vi
      .spyOn(domain, 'shuffleFromSolved')
      .mockReturnValue(puzzleMock);

    const startGame = new StartGame(imagePort);

    const game = startGame.execute({ kind: 'default' });

    expect(imagePort.getDefaultImageUrl).toHaveBeenCalledTimes(1);
    expect(imagePort.readAsDataUrl).not.toHaveBeenCalled();
    expect(shuffleSpy).toHaveBeenCalledWith(4, 4, 300);
    expect(game).toEqual({
      imageUrl: 'default-url',
      puzzle: puzzleMock,
      status: 'playing',
    });

    shuffleSpy.mockRestore();
  });

  it('starts a game from an uploaded file using a data URL', () => {
    const imagePort = {
      getDefaultImageUrl: vi.fn(),
      readAsDataUrl: vi.fn().mockResolvedValue('data:image/png;base64,abc'),
    };

    const shuffleSpy = vi
      .spyOn(domain, 'shuffleFromSolved')
      .mockReturnValue(puzzleMock);

    const startGame = new StartGame(imagePort);

    const game = startGame.execute({ kind: 'upload', imageUrl: 'data:image/png;base64,abc' });

    expect(imagePort.getDefaultImageUrl).not.toHaveBeenCalled();
    expect(shuffleSpy).toHaveBeenCalledWith(4, 4, 300);
    expect(game.imageUrl).toBe('data:image/png;base64,abc');
    expect(game.puzzle).toBe(puzzleMock);
    expect(game.status).toBe('playing');

    shuffleSpy.mockRestore();
  });
});
