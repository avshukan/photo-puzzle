import type { PuzzleState } from '../../domain';

export type GameStatus = 'playing' | 'won';

export type Game = Readonly<{
  imageUrl: string;
  puzzle: PuzzleState;
  status: GameStatus;
}>;
