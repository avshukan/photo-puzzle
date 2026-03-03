# Domain Model

## Entity

PuzzleState

- width: number
- height: number
- tiles: number[]  // length = width * height

0 represents the empty cell.

## Invariants

1. tiles.length === width * height
2. Exactly one tile equals 0
3. Other tiles are unique numbers in range 1..(width*height - 1)

## Solved State

Solved layout:
[1, 2, 3, ..., N-1, 0]
where N = width * height

## Move Rules

- A tile can move only if it is adjacent to the empty cell.
- Adjacency is defined by Manhattan distance = 1.
- No diagonal moves.

## Domain API

- createSolved(width, height): PuzzleState
- isSolved(state): boolean
- canMove(state, fromIndex): boolean
- applyMove(state, fromIndex): PuzzleState
- shuffleFromSolved(width, height, steps = 300): PuzzleState
