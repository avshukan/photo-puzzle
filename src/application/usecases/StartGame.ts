import { shuffleFromSolved } from '../../domain';
import type { Game } from '../models/Game';
import type { ImageUrlPort } from '../ports/ImageUrlPort';

export type StartGameInput =
  | { kind: 'default' }
  | { kind: 'upload'; file: File };

export class StartGame {
  private readonly imagePort: ImageUrlPort;

  constructor(imagePort: ImageUrlPort) {
    this.imagePort = imagePort;
  }

  execute(input: StartGameInput): Game {
    const imageUrl =
      input.kind === 'default'
        ? this.imagePort.getDefaultImageUrl()
        : this.imagePort.createObjectUrl(input.file);

    // TODO: make it configurable
    const puzzle = shuffleFromSolved(4, 4, 300);

    return {
      imageUrl,
      puzzle,
      status: 'playing',
    };
  }
}