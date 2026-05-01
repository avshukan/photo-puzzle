import type { Game } from '../models/Game';

export interface GameStoragePort {
  save(game: Game): boolean;

  load(): Game | null;

  clear(): void;
}
