# Photo Puzzle

15-puzzle game in the browser. Upload your photo or start immediately with a default image.

## Demo

https://puzzle-photo.avshukan.com/

## Features (v0.2.0)

- 4×4 puzzle (15 tiles + 1 empty)
- Click adjacent tile to move
- Always solvable shuffle
- Default image on first load
- Upload local image to start a new game
- Game state persists after reload
- Uploaded image is restored
- Preview original image
- Responsive board (mobile-friendly)
- Victory modal on solve

## Architecture (Clean Architecture)

- `src/domain` — puzzle rules (pure functions)
- `src/application` — use cases (`StartGame`, `MoveTile`)
- `src/infrastructure` — browser adapters (storage, image)
- `src/presentation` — React UI

Domain has no dependency on React/DOM/browser APIs.

## Process

We follow **Incremental Delivery**.

- Work is planned in **iterations**
- Each iteration delivers a **vertical slice**
- Each merge to `main` is automatically deployed

Versioning: **SemVer** (`v0.x.y`)

- `v0.(x+1).0` — new features
- `v0.x.(y+1)` — fixes

## Scripts

```bash
npm install
npm run dev
npm test
npm run test:coverage
npm run build
npm run preview
```
