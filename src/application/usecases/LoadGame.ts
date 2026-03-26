import type { Game } from '../models/Game';
import type { GameStoragePort } from '../ports/GameStoragePort';

export class LoadGame {
  private readonly storage: GameStoragePort;

  constructor(storage: GameStoragePort) {
    this.storage = storage;
  }

  execute(): Game | null {
    return this.storage.load();
  }
}
