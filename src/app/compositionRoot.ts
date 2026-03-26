import { MoveTile, StartGame } from '../application';
import { BrowserImageUrlAdapter } from '../infrastructure/image/BrowserImageUrlAdapter';
import { LocalStorageGameStorageAdapter } from '../infrastructure/storage/LocalStorageGameStorageAdapter';
import { LoadGame } from '../application/usecases/LoadGame';
import { GameService } from '../application/services/GameService';

const imageUrlPort = new BrowserImageUrlAdapter();

const gameStorage = new LocalStorageGameStorageAdapter(imageUrlPort);

const startGame = new StartGame(imageUrlPort);

const moveTile = new MoveTile();

const loadGame = new LoadGame(gameStorage);

export const gameService = new GameService(
  startGame,
  moveTile,
  loadGame,
  gameStorage,
);

export const ports = {
  imageUrlPort,
};
