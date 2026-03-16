# Photo Puzzle

15-puzzle game in the browser. Upload your photo or start immediately with a default image.

## Demo

https://avshukan.github.io/photo-puzzle/

## MVP

- 4×4 board (15 tiles + 1 empty)
- Click adjacent tile to move
- Always solvable shuffle (random legal moves)
- Default image on first load
- Upload local image to restart the game
- Victory message on solved
- No backend. Images stay in the browser.

## Architecture (Clean Architecture)

- `src/domain` — puzzle rules (pure functions)
- `src/application` — use cases (`StartGame`, `MoveTile`)
- `src/infrastructure` — browser adapters (object URL, default image)
- `src/presentation` — React UI

Domain has no dependency on React/DOM/browser APIs.

## Process

We follow **Incremental Delivery**.

- Work is planned in **iterations**.
- Each iteration is a set of **vertical slices** (end-to-end features).
- Each iteration ends with a **release** (tag + deploy).

Versioning: **SemVer** (`v0.x.y`).

- `v0.(x+1).0` — new features / noticeable increment
- `v0.x.(y+1)` — fixes / small improvements

Backlog and iteration plans live in `docs/` (see below).

## Scripts

```bash
npm install
npm run dev
npm test
npm run test:coverage
npm run build
npm run preview
```
