import { MoveTile, StartGame } from '../application';
import { BrowserImageUrlAdapter } from '../infrastructure/image/BrowserImageUrlAdapter';
import { LocalStorageGameStorageAdapter } from '../infrastructure/storage/LocalStorageGameStorageAdapter';
import { GameService } from '../application/services/GameService';

const imageUrlPort = new BrowserImageUrlAdapter();

const gameStorage = new LocalStorageGameStorageAdapter();

const startGame = new StartGame(imageUrlPort);

const moveTile = new MoveTile();

export const gameService = new GameService(
  startGame,
  moveTile,
  gameStorage,
  imageUrlPort,
);

export const ports = {
  imageUrlPort,
};
