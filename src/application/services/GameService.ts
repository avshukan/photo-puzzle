import type { Game } from '../models/Game';
import type { StartGame } from '../usecases/StartGame';
import type { MoveTile } from '../usecases/MoveTile';
import type { GameStoragePort } from '../ports/GameStoragePort';
import { validateImage } from './imageValidation';
import { processImage, fitImageForStorage } from './imageProcessing';

export type UploadResult = Readonly<{
  game: Game;
  persisted: boolean;
}>;

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

  async startWithUpload(file: File): Promise<UploadResult> {
    await validateImage(file);

    const processedImage = await processImage(file);

    const fit = await fitImageForStorage(file, processedImage.dataUrl);

    const game = this.startGame.execute({
      kind: 'upload',
      imageUrl: fit.dataUrl,
    });

    if (fit.canStore) {
      this.storage.save(game);
    }

    return { game, persisted: fit.canStore };
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
