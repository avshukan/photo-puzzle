import type { Game } from '../models/Game';
import type { StartGame } from '../usecases/StartGame';
import type { MoveTile } from '../usecases/MoveTile';
import type { GameStoragePort } from '../ports/GameStoragePort';
import { validateImage } from './imageValidation';
import { processImage } from './imageProcessing';

export class GameService {
  private readonly startGame: StartGame;
  private readonly moveTile: MoveTile;
  private readonly storage: GameStoragePort;

  constructor(
    startGame: StartGame,
    moveTile: MoveTile,
    storage: GameStoragePort,
  ) {
    this.startGame = startGame;
    this.moveTile = moveTile;
    this.storage = storage;
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
    await validateImage(file);

    const processedImage = await processImage(file);

    const game = this.startGame.execute({
      kind: 'upload',
      imageUrl: processedImage.dataUrl,
    });

    this.storage.save(game);

    return game;
  }

  move(game: Game, fromIndex: number): Game {
    const next = this.moveTile.execute(game, fromIndex);

    this.storage.save(next);

    return next;
  }

  reset(): void {
    this.storage.clear();
  }
}
