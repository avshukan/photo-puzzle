export type Tile = number; // 0 = empty

export type PuzzleState = Readonly<{
  width: number;
  height: number;
  tiles: readonly Tile[];
}>;
