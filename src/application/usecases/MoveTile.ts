import { applyMove, isSolved } from '../../domain';
import type { Game } from '../models/Game';

export class MoveTile {
  execute(game: Game, fromIndex: number): Game {
    if (game.status === 'won') {
      return game;
    }

    const nextPuzzle = applyMove(game.puzzle, fromIndex);

    return {
      ...game,
      puzzle: nextPuzzle,
      status: isSolved(nextPuzzle) ? 'won' : 'playing',
    };
  }
}
