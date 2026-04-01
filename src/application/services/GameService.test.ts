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
import type { ImageUrlPort } from '../ports/ImageUrlPort';
import { GameService } from './GameService';

function mockImageLoad(width = 1000, height = 1000) {
  const originalImage = globalThis.Image;

  class MockImage {
    width = width;
    height = height;
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;

    set src(_value: string) {
      setTimeout(() => {
        this.onload?.();
      }, 0);
    }
  }

  globalThis.Image = MockImage as unknown as typeof Image;

  return () => {
    globalThis.Image = originalImage;
  };
}

describe('GameService', () => {
  let startGameExecute: Mock<StartGame['execute']>;
  let startGame: StartGame;
  let moveTileExecute: Mock<MoveTile['execute']>;
  let moveTile: MoveTile;
  let storageSave: Mock<GameStoragePort['save']>;
  let storageLoad: Mock<GameStoragePort['load']>;
  let storageClear: Mock<GameStoragePort['clear']>;
  let storage: GameStoragePort;
  let imageUrlPort: ImageUrlPort;
  let restoreImage: (() => void) | null;

  let service: GameService;

  const game: Game = {
    puzzle: { width: 4, height: 4, tiles: [1, 2, 3] as const },
    imageUrl: 'url',
    status: 'playing',
  };

  beforeEach(() => {
    restoreImage = mockImageLoad();

    startGameExecute = vi.fn();

    startGame = {
      execute: startGameExecute,
      imagePort: {
        getDefaultImageUrl: vi.fn(),
        readAsDataUrl: vi.fn(),
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

    imageUrlPort = {
      getDefaultImageUrl: vi.fn(),
      readAsDataUrl: vi.fn(),
    };

    service = new GameService(startGame, moveTile, storage, imageUrlPort);
  });

  afterEach(() => {
    restoreImage?.();
    restoreImage = null;

    vi.restoreAllMocks();
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

  it('startWithUpload() reads data URL, starts game and saves it', async () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });

    const dataUrl = 'data:image/png;base64,abc';

    vi.mocked(imageUrlPort.readAsDataUrl).mockResolvedValue(dataUrl);

    startGameExecute.mockReturnValue(game);

    const result = await service.startWithUpload(file);

    expect(imageUrlPort.readAsDataUrl).toHaveBeenCalledWith(file);

    expect(startGameExecute).toHaveBeenCalledWith({
      kind: 'upload',
      imageUrl: dataUrl,
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

  it('falls back to default on read error', async () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });

    vi.mocked(imageUrlPort.readAsDataUrl).mockRejectedValue(new Error());

    startGameExecute.mockReturnValue(game);

    const result = await service.startWithUpload(file);

    expect(startGameExecute).toHaveBeenCalledWith({ kind: 'default' });

    expect(storageSave).toHaveBeenCalledWith(game);

    expect(result).toBe(game);
  });

  it('falls back to default when file exceeds size limit', async () => {
    const content = new Uint8Array(30 * 1024 * 1024); // 30 MB

    const file = new File([content], 'large.png', { type: 'image/png' });

    startGameExecute.mockReturnValue(game);

    const result = await service.startWithUpload(file);

    expect(imageUrlPort.readAsDataUrl).not.toHaveBeenCalled();

    expect(startGameExecute).toHaveBeenCalledWith({ kind: 'default' });

    expect(storageSave).toHaveBeenCalledWith(game);

    expect(result).toBe(game);
  });
});
