import type { Game } from '../models/Game';

export interface GameStoragePort {
  save(game: Game): void;

  load(): Game | null;

  clear(): void;
}
