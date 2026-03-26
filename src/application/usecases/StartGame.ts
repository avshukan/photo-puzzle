import { shuffleFromSolved } from '../../domain';
import type { Game } from '../models/Game';
import type { ImageUrlPort, ImageUrl } from '../ports/ImageUrlPort';

export type StartGameInput =
  | { kind: 'default' }
  | { kind: 'upload'; imageUrl: ImageUrl };

export class StartGame {
  private readonly imagePort: ImageUrlPort;

  constructor(imagePort: ImageUrlPort) {
    this.imagePort = imagePort;
  }

  execute(input: StartGameInput): Game {
    const imageUrl =
      input.kind === 'default'
        ? this.imagePort.getDefaultImageUrl()
        : input.imageUrl;

    // TODO: make it configurable
    const puzzle = shuffleFromSolved(4, 4, 300);

    return {
      imageUrl,
      puzzle,
      status: 'playing',
    };
  }
}
