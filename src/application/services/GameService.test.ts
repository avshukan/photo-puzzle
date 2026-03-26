import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import type { Game } from '../models/Game';
import type { StartGame } from '../usecases/StartGame';
import type { MoveTile } from '../usecases/MoveTile';
import type { GameStoragePort } from '../ports/GameStoragePort';
import { GameService } from './GameService';

describe('GameService', () => {
  let startGameExecute: Mock<StartGame['execute']>;
  let startGame: StartGame;
  let moveTileExecute: Mock<MoveTile['execute']>;
  let moveTile: MoveTile;
  let storageSave: Mock<GameStoragePort['save']>;
  let storageLoad: Mock<GameStoragePort['load']>;
  let storageClear: Mock<GameStoragePort['clear']>;
  let storage: GameStoragePort;

  let service: GameService;

  const game: Game = {
    puzzle: { width: 4, height: 4, tiles: [1, 2, 3] as const },
    imageUrl: 'url',
    status: 'playing',
  };

  beforeEach(() => {
    startGameExecute = vi.fn();
    startGame = {
      execute: startGameExecute,
      imagePort: {
        getDefaultImageUrl: vi.fn(),
        createObjectUrl: vi.fn(),
        revokeObjectUrl: vi.fn(),
      },
    } as unknown as StartGame;

    moveTileExecute = vi.fn();
    moveTile = {
      execute: moveTileExecute,
    } as unknown as MoveTile;

    storageSave = vi.fn();
    storageLoad = vi.fn();
    storageClear = vi.fn();
    storage = {
      save: storageSave,
      load: storageLoad,
      clear: storageClear,
    } as GameStoragePort;

    service = new GameService(startGame, moveTile, storage);
  });

  it('init() returns saved game if exists', () => {
    storageLoad.mockReturnValue(game);

    const result = service.init();

    expect(result).toBe(game);
    expect(startGameExecute).not.toHaveBeenCalled();
    expect(storageSave).not.toHaveBeenCalled();
  });

  it('init() starts new game if no saved game', () => {
    storageLoad.mockReturnValue(null);
    startGameExecute.mockReturnValue(game);

    const result = service.init();

    expect(startGameExecute).toHaveBeenCalledWith({ kind: 'default' });
    expect(storageSave).toHaveBeenCalledWith(game);
    expect(result).toBe(game);
  });

  it('startWithUpload() starts game and saves it', () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });

    startGameExecute.mockReturnValue(game);

    const result = service.startWithUpload(file);

    expect(startGameExecute).toHaveBeenCalledWith({
      kind: 'upload',
      file,
    });
    expect(storageSave).toHaveBeenCalledWith(game);
    expect(result).toBe(game);
  });

  it('move() applies move and saves result', () => {
    const nextGame: Game = { ...game, status: 'won' };

    moveTileExecute.mockReturnValue(nextGame);

    const result = service.move(game, 1);

    expect(moveTileExecute).toHaveBeenCalledWith(game, 1);
    expect(storageSave).toHaveBeenCalledWith(nextGame);
    expect(result).toBe(nextGame);
  });

  it('reset() clears storage', () => {
    service.reset();

    expect(storageClear).toHaveBeenCalled();
  });
});
