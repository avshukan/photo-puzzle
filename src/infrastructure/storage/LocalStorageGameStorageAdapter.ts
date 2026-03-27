import type { GameStoragePort } from '../../application/ports/GameStoragePort';
import type { Game } from '../../application/models/Game';

const STORAGE_KEY = 'photo-puzzle.game';

export class LocalStorageGameStorageAdapter implements GameStoragePort {
  save(game: Game): void {
    try {
      const persisted = {
        puzzle: game.puzzle,
        imageUrl: game.imageUrl,
        status: game.status,
      };

      const serialized = JSON.stringify(persisted);

      localStorage.setItem(STORAGE_KEY, serialized);
    } catch {
      // fallback: очищаем storage и пробуем сохранить заново
      try {
        localStorage.removeItem(STORAGE_KEY);

        const fallback = {
          puzzle: game.puzzle,
          imageUrl: game.imageUrl,
          status: game.status,
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
      } catch {
        // окончательно игнорируем (лучше, чем падение)
      }
    }
  }

  load(): Game | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY);

      if (!data) return null;

      const parsed = JSON.parse(data);

      if (
        !parsed ||
        typeof parsed !== 'object' ||
        !parsed.puzzle ||
        typeof parsed.imageUrl !== 'string' ||
        (parsed.status !== 'playing' && parsed.status !== 'won')
      ) {
        return null;
      }

      const { puzzle } = parsed;

      if (
        typeof puzzle.width !== 'number' ||
        typeof puzzle.height !== 'number' ||
        !Array.isArray(puzzle.tiles)
      ) {
        return null;
      }

      return parsed as Game;
    } catch {
      return null;
    }
  }

  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }
}
