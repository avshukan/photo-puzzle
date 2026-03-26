import type { GameStoragePort } from '../../application/ports/GameStoragePort';
import type { Game } from '../../application/models/Game';
import type { ImageUrlPort } from '../../application/ports/ImageUrlPort';

const STORAGE_KEY = 'photo-puzzle.game';

export class LocalStorageGameStorageAdapter implements GameStoragePort {
  private readonly imagePort: ImageUrlPort;

  constructor(imagePort: ImageUrlPort) {
    this.imagePort = imagePort;
  }

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

      // fallback for blob URL
      if (parsed.imageUrl?.startsWith('blob:')) {
        return {
          ...parsed,
          imageUrl: this.imagePort.getDefaultImageUrl(),
        };
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
