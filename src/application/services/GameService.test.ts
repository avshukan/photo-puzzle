import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import type { Game } from '../models/Game';
import { GameService } from './GameService';

describe('GameService', () => {
  type StorageMock = {
    save: Mock<(game: unknown) => void>;
    load: Mock<() => unknown>;
    clear: Mock<() => void>;
  };

  let startGame: GameService['startGame'];
  let startGameExecute: Mock<GameService['startGame']['execute']>;
  let moveTile: GameService['moveTile'];
  let moveTileExecute: Mock<GameService['moveTile']['execute']>;
  let loadGame: GameService['loadGame'];
  let loadGameExecute: Mock<GameService['loadGame']['execute']>;
  let storage: GameService['storage'];
  let storageSave: Mock<StorageMock['save']>;
  let storageLoad: Mock<StorageMock['load']>;
  let storageClear: Mock<StorageMock['clear']>;

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
    } as unknown as GameService['startGame'];

    moveTileExecute = vi.fn();
    moveTile = {
      execute: moveTileExecute,
    } as unknown as GameService['moveTile'];

    loadGameExecute = vi.fn();
    loadGame = {
      execute: loadGameExecute,
    } as unknown as GameService['loadGame'];

    storageSave = vi.fn();
    storageLoad = vi.fn();
    storageClear = vi.fn();
    storage = {
      save: storageSave,
      load: storageLoad,
      clear: storageClear,
    } as GameService['storage'];

    service = new GameService(startGame, moveTile, loadGame, storage);
  });

  it('init() returns saved game if exists', () => {
    loadGameExecute.mockReturnValue(game);

    const result = service.init();

    expect(result).toBe(game);
    expect(startGameExecute).not.toHaveBeenCalled();
    expect(storageSave).not.toHaveBeenCalled();
  });

  it('init() starts new game if no saved game', () => {
    loadGameExecute.mockReturnValue(null);
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
