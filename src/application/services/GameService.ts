import type { Game } from '../models/Game';
import type { StartGame } from '../usecases/StartGame';
import type { MoveTile } from '../usecases/MoveTile';
import type { GameStoragePort } from '../ports/GameStoragePort';
import type { ImageUrlPort } from '../ports/ImageUrlPort';
import { validateImage } from './imageValidation';

export class GameService {
  private readonly startGame: StartGame;
  private readonly moveTile: MoveTile;
  private readonly storage: GameStoragePort;
  private readonly imageUrlPort: ImageUrlPort;

  constructor(
    startGame: StartGame,
    moveTile: MoveTile,
    storage: GameStoragePort,
    imageUrlPort: ImageUrlPort,
  ) {
    this.startGame = startGame;
    this.moveTile = moveTile;
    this.storage = storage;
    this.imageUrlPort = imageUrlPort;
  }

  init(): Game {
    const saved = this.storage.load();

    if (saved) {
      return saved;
    }

    const game = this.startGame.execute({ kind: 'default' });

    this.storage.save(game);

    return game;
  }

  async startWithUpload(file: File): Promise<Game> {
    try {
      await validateImage(file);

      const imageUrl = await this.imageUrlPort.readAsDataUrl(file);

      const game = this.startGame.execute({
        kind: 'upload',
        imageUrl,
      });

      this.storage.save(game);

      return game;
    } catch {
      return this.startDefaultGame();
    }
  }

  move(game: Game, fromIndex: number): Game {
    const next = this.moveTile.execute(game, fromIndex);

    this.storage.save(next);

    return next;
  }

  reset(): void {
    this.storage.clear();
  }

  private startDefaultGame(): Game {
    const game = this.startGame.execute({ kind: 'default' });

    this.storage.save(game);

    return game;
  }
}
