import { MoveTile, StartGame } from '../application';
import { BrowserImageUrlAdapter } from '../infrastructure/image/BrowserImageUrlAdapter';

const imageUrlPort = new BrowserImageUrlAdapter();

export const useCases = {
  startGame: new StartGame(imageUrlPort),
  moveTile: new MoveTile(),
};

export const ports = {
  imageUrlPort,
};
