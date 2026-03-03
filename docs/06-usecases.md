# Use Cases (MVP)

## Application model

Game:
- imageUrl: string
- puzzle: PuzzleState
- status: "playing" | "won"

PuzzleState is a domain entity.
Game is an application-level model.

---

## Use case: StartGame

Input:
- { kind: "default" }
- { kind: "upload", file: File }

Output:
- Game

Behavior:
- Resolve imageUrl using ImageUrlPort
- Create puzzle = shuffleFromSolved(width, height, steps)
- Return Game with status "playing"

Notes:
- width/height/steps are fixed for MVP (4x4, steps=300)

---

## Use case: MoveTile

Input:
- game: Game
- fromIndex: number

Output:
- Game (new instance)

Behavior:
- If game.status is "won" -> return game
- Apply domain applyMove
- If isSolved -> status "won" else "playing"
- Return updated Game

---

## Ports

ImageUrlPort:
- getDefaultImageUrl(): string
- createObjectUrl(file: File): string
- revokeObjectUrl(url: string): void (optional)
