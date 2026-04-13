import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  type Mock,
} from 'vitest';
import type { Game } from '../models/Game';
import type { StartGame } from '../usecases/StartGame';
import type { MoveTile } from '../usecases/MoveTile';
import type { GameStoragePort } from '../ports/GameStoragePort';
import { GameService } from './GameService';
import { ImageTooLargeError } from '../errors/ImageErrors';

vi.mock('./imageValidation', () => ({
  validateImage: vi.fn(),
}));

vi.mock('./imageProcessing', () => ({
  processImage: vi.fn(),
}));

import { validateImage } from './imageValidation';
import { processImage } from './imageProcessing';

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
    imageUrl: 'image-url',
    puzzle: {
      width: 4,
      height: 4,
      tiles: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0],
    },
    status: 'playing',
  };

  beforeEach(() => {
    vi.clearAllMocks();

    startGameExecute = vi.fn();

    startGame = {
      execute: startGameExecute,
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
    };

    service = new GameService(startGame, moveTile, storage);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('init() returns saved game if exists', () => {
    storageLoad.mockReturnValue(game);

    const result = service.init();

    expect(storageLoad).toHaveBeenCalled();
    expect(startGameExecute).not.toHaveBeenCalled();
    expect(storageSave).not.toHaveBeenCalled();
    expect(result).toBe(game);
  });

  it('init() starts default game and saves it when storage is empty', () => {
    storageLoad.mockReturnValue(null);
    startGameExecute.mockReturnValue(game);

    const result = service.init();

    expect(storageLoad).toHaveBeenCalled();
    expect(startGameExecute).toHaveBeenCalledWith({ kind: 'default' });
    expect(storageSave).toHaveBeenCalledWith(game);
    expect(result).toBe(game);
  });

  it('startWithUpload() validates, processes, starts game and saves it', async () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const processedImage = {
      dataUrl: 'data:image/jpeg;base64,processed',
      width: 1024,
      height: 768,
      wasTransformed: true,
    };

    vi.mocked(validateImage).mockResolvedValue(undefined);
    vi.mocked(processImage).mockResolvedValue(processedImage);
    startGameExecute.mockReturnValue(game);

    const result = await service.startWithUpload(file);

    expect(validateImage).toHaveBeenCalledWith(file);
    expect(processImage).toHaveBeenCalledWith(file);
    expect(startGameExecute).toHaveBeenCalledWith({
      kind: 'upload',
      imageUrl: processedImage.dataUrl,
    });
    expect(storageSave).toHaveBeenCalledWith(game);
    expect(result).toBe(game);
  });

  it('startWithUpload() rejects when input validation fails', async () => {
    const file = new File(['test'], 'large.png', { type: 'image/png' });

    vi.mocked(validateImage).mockRejectedValue(new ImageTooLargeError(10));

    await expect(service.startWithUpload(file)).rejects.toBeInstanceOf(
      ImageTooLargeError,
    );

    expect(processImage).not.toHaveBeenCalled();
    expect(startGameExecute).not.toHaveBeenCalled();
    expect(storageSave).not.toHaveBeenCalled();
  });

  it('startWithUpload() rejects when image processing fails', async () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });

    vi.mocked(validateImage).mockResolvedValue(undefined);
    vi.mocked(processImage).mockRejectedValue(new Error('Processing failed'));

    await expect(service.startWithUpload(file)).rejects.toThrow(
      'Processing failed',
    );

    expect(validateImage).toHaveBeenCalledWith(file);
    expect(processImage).toHaveBeenCalledWith(file);
    expect(startGameExecute).not.toHaveBeenCalled();
    expect(storageSave).not.toHaveBeenCalled();
  });

  it('move() applies move and saves result', () => {
    const nextGame: Game = { ...game, status: 'won' };

    moveTileExecute.mockReturnValue(nextGame);

    const result = service.move(game, 14);

    expect(moveTileExecute).toHaveBeenCalledWith(game, 14);
    expect(storageSave).toHaveBeenCalledWith(nextGame);
    expect(result).toBe(nextGame);
  });

  it('reset() clears storage', () => {
    service.reset();

    expect(storageClear).toHaveBeenCalled();
  });
});
