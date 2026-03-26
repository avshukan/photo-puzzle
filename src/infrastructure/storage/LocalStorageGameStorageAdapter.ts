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

      localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    } catch {
      // ignore
    }
  }

  load(): Game | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;

      const parsed = JSON.parse(raw);

      if (!parsed?.puzzle || !parsed?.imageUrl) {
        return null;
      }

      return parsed;
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
