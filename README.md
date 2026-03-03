# Photo Puzzle 4×4

Browser-based 15 puzzle game built with React and TypeScript.

The user can immediately start playing with a default image or upload a personal photo to solve.

## MVP Features

- Fixed 4×4 grid
- One empty cell
- Click on adjacent tile to move
- Always solvable shuffle
- Default image on first load
- Upload local image
- Victory message on solve
- Minimalistic UI

## Architecture

The project follows Clean Architecture principles.

- domain — game rules and logic
- application — use cases
- infrastructure — browser adapters
- presentation — React UI

Domain layer has no dependency on React or browser APIs.

## Tech Stack

- Vite
- React
- TypeScript

## Run locally

```bash
npm install
npm run dev
```
