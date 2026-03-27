import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Game } from '../../application/models/Game';
import { LocalStorageGameStorageAdapter } from './LocalStorageGameStorageAdapter';

describe('LocalStorageGameStorageAdapter', () => {
  const STORAGE_KEY = 'photo-puzzle.game';

  const createAdapter = () => {
    const adapter = new LocalStorageGameStorageAdapter();

    return { adapter };
  };

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('saves game to localStorage', () => {
    const { adapter } = createAdapter();

    const game: Game = {
      puzzle: { width: 4, height: 4, tiles: [1, 2, 3] as const },
      imageUrl: 'url',
      status: 'playing',
    };

    adapter.save(game);

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);

    expect(stored).toEqual(game);
  });

  it('loads game from localStorage', () => {
    const { adapter } = createAdapter();

    const game: Game = {
      puzzle: { width: 4, height: 4, tiles: [1, 2, 3] as const },
      imageUrl: 'url',
      status: 'playing',
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(game));

    const result = adapter.load();

    expect(result).toEqual(game);
  });

  it('returns null if nothing stored', () => {
    const { adapter } = createAdapter();

    const result = adapter.load();

    expect(result).toBeNull();
  });

  it('returns null if JSON is invalid', () => {
    const { adapter } = createAdapter();

    localStorage.setItem(STORAGE_KEY, '{ invalid json');

    const result = adapter.load();

    expect(result).toBeNull();
  });

  it('loads game with data URL imageUrl from localStorage', () => {
    const { adapter } = createAdapter();

    const game: Game = {
      puzzle: { width: 4, height: 4, tiles: [1, 2, 3] as const },
      imageUrl: 'data:image/png;base64,abc123',
      status: 'playing',
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(game));

    const result = adapter.load();

    expect(result).toEqual(game);
  });

  it('returns null if puzzle is missing', () => {
    const { adapter } = createAdapter();

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ imageUrl: 'url', status: 'playing' }),
    );

    expect(adapter.load()).toBeNull();
  });

  it('returns null if imageUrl is not a string', () => {
    const { adapter } = createAdapter();

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        puzzle: { width: 4, height: 4, tiles: [1] },
        imageUrl: 123,
        status: 'playing',
      }),
    );

    expect(adapter.load()).toBeNull();
  });

  it('returns null if status is invalid', () => {
    const { adapter } = createAdapter();

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        puzzle: { width: 4, height: 4, tiles: [1] },
        imageUrl: 'url',
        status: 'unknown',
      }),
    );

    expect(adapter.load()).toBeNull();
  });

  it('returns null if puzzle.width is not a number', () => {
    const { adapter } = createAdapter();

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        puzzle: { width: 'four', height: 4, tiles: [1] },
        imageUrl: 'url',
        status: 'playing',
      }),
    );

    expect(adapter.load()).toBeNull();
  });

  it('returns null if puzzle.tiles is not an array', () => {
    const { adapter } = createAdapter();

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        puzzle: { width: 4, height: 4, tiles: 'not-array' },
        imageUrl: 'url',
        status: 'playing',
      }),
    );

    expect(adapter.load()).toBeNull();
  });

  it('retries save after clearing storage on first failure', () => {
    const { adapter } = createAdapter();

    const game: Game = {
      puzzle: { width: 4, height: 4, tiles: [1, 2, 3] as const },
      imageUrl: 'url',
      status: 'playing',
    };

    let callCount = 0;

    const originalSetItem = localStorage.setItem.bind(localStorage);

    vi.spyOn(localStorage, 'setItem').mockImplementation((key, value) => {
      callCount++;
      if (callCount === 1) throw new Error('quota exceeded');
      originalSetItem(key, value);
    });

    adapter.save(game);

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);

    expect(stored).toEqual(game);
  });

  it('clears storage', () => {
    const { adapter } = createAdapter();

    localStorage.setItem(STORAGE_KEY, 'test');

    adapter.clear();

    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});
