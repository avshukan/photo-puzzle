# AGENTS.md

Guidance for AI agents working in this repository.

## Project Snapshot

Photo Puzzle is a browser-based 15-puzzle game for kids, family, and friends.
The product goal is simple: a player should be able to open the page and start
playing immediately, either with a bundled/default image or with a local photo.

Demo: https://puzzle-photo.avshukan.com/

The app is a Vite + React + TypeScript project using Clean Architecture.

## Current Iteration

Current branch/scope is Iteration 3. Read these first:

- `docs/iterations/iter-03.md`
- `docs/08-backlog.md`

Iteration 3 focus:

- make the app feel installable and PWA-like
- add bundled preset images and an image picker
- keep upload and existing saved-game behavior working

Current iteration items in the backlog are kept under `## Current Iteration`.
When the iteration finishes, move the full scope from `Current Iteration` to
`Done` together; do not mark individual tasks done one by one unless the user
explicitly asks for that workflow.

## Essential Docs

Read the relevant docs before changing behavior:

- `docs/00-vision.md` - product intent and audience
- `docs/01-mvp-scope.md` - original included/excluded scope
- `docs/03-business-requirements.md` - functional and non-functional rules
- `docs/04-decisions.md` - technical decisions, especially image handling
- `docs/05-domain-model.md` - puzzle state and invariants
- `docs/06-usecases.md` - application-level flows
- `docs/07-process.md` - iteration/release process
- `docs/09-architecture.md` - Clean Architecture boundaries
- `docs/10-known-limitations.md` - current tradeoffs and constraints

Keep docs and code aligned when a task changes behavior or process.

## Architecture Rules

The repository follows Clean Architecture:

- `src/domain` - pure puzzle logic only
- `src/application` - use cases, application models, ports, services
- `src/infrastructure` - browser adapters such as storage and image handling
- `src/presentation` - React UI and browser interaction
- `src/app` - composition/configuration

Hard boundaries:

- Domain must not import React, DOM APIs, localStorage, File, canvas, or other
  browser/infrastructure concerns.
- Presentation should call application services/use cases rather than encoding
  puzzle rules directly.
- Infrastructure should implement ports and isolate browser APIs.
- Prefer vertical slices that touch the smallest necessary set of layers.

Important current flows:

- App initialization: `GameService.init()` restores saved game or starts default.
- Upload: validate -> process/compress -> fit for localStorage -> start new game.
- Move: UI calls `GameService.move()`, which delegates to `MoveTile`.
- Shuffle: `GameService.shuffle()` restarts with the current image URL.

## Domain Invariants

`PuzzleState`:

- `width: number`
- `height: number`
- `tiles: number[]`
- `tiles.length === width * height`
- exactly one tile is `0`
- `0` is the empty cell
- solved layout is `[1, 2, ..., N - 1, 0]`

Movement rules:

- only adjacent tiles can move
- adjacency is Manhattan distance `1`
- no diagonal moves
- invalid moves return the original state

Shuffle rule:

- use random legal moves from a solved state so the puzzle is always solvable
- do not replace this with arbitrary array shuffling unless solvability is
  explicitly preserved and tested

## Image Handling Rules

The Iteration 2 image pipeline is intentional. Preserve it unless a task
explicitly changes it.

Model: reject -> normalize -> fit.

- Reject uploads over `10MB`
- Reject images with width or height over `8000px`
- Normalize large accepted images to max `1024px`, JPEG quality `0.75`
- Store small images as-is when they are within `1MB` and `1024px`
- Target stored data URL size is `<= 2MB`
- If still too large, retry at max `800px`
- If storage still fails, use the image in memory and warn the user

Images must not leave the browser. Do not add server upload behavior unless the
product direction changes explicitly.

## Storage Rules

Current persistence uses `localStorage` with key `photo-puzzle.game`.

Known limits:

- browser-dependent size limit around `5MB`
- data URLs add roughly 30-40% overhead
- if storage fails, the app may continue in-memory for the current session

When changing the persisted shape:

- update validation in `LocalStorageGameStorageAdapter`
- preserve compatibility or safely ignore invalid old data
- add tests for malformed/incompatible persisted data

## UI/UX Direction

The app should stay simple, minimal, and playable by non-technical users,
including kids.

Prefer:

- direct playable UI over marketing/landing-page UI
- clear controls with compact layout
- mobile-friendly board and controls
- visible user feedback for upload/storage errors
- first-run flow that lets the user play without having a local image

Avoid:

- cluttering the top controls as new actions are added
- making presets, upload, preview, shuffle, and random actions feel unrelated
- adding hidden complexity that makes the first game slower to start

## PWA Direction

Iteration 3 includes basic PWA support:

- web app manifest
- project-specific icons/metadata/theme color
- service worker for offline app shell
- installability check via Lighthouse or manual checklist

Keep this scope modest:

- cache the app shell and bundled assets
- do not promise advanced offline behavior for user-uploaded images
- verify behavior in a production-like build where possible

## Backlog And Iteration Process

Backlog lives in `docs/08-backlog.md`.

Sections:

- `Current Iteration` - full scope of the active iteration
- `Todo` - future work
- `Done` - completed work
- `Rejected` - intentionally not doing

Each backlog item needs:

- ID
- Title
- Type: `Value`, `Quality`, or `Refactor`
- Priority: `High`, `Medium`, or `Low`
- Notes

Process:

- Before implementation, check `docs/iterations/iter-XX.md`
- Keep iteration scope stable during implementation
- If new ideas appear during an iteration, add them to `Todo`, not to current
  scope, unless the user explicitly changes scope
- At iteration completion, update `CHANGELOG.md` and release/version docs

## Commands

Use these commands from the repository root:

```bash
npm install
npm run dev
npm test
npm run test:coverage
npm run lint:check
npm run build
npm run preview
```

Notes:

- `npm run lint` runs ESLint with `--fix`; use `lint:check` when you only want
  verification.
- Run focused tests while developing, then run the broader checks before
  finishing meaningful changes.
- For documentation-only changes, tests are usually not necessary; mention that
  they were not run.

## Testing Guidance

Existing test style:

- Vitest
- jsdom
- React Testing Library
- tests live next to the code they cover

Add or update tests when changing:

- domain rules
- shuffle/solvability behavior
- use cases
- storage schema/validation
- image validation/processing
- UI behavior visible to users
- PWA install/offline behavior where practical

Keep tests focused on behavior rather than implementation details.

## Coding Style

Follow the existing TypeScript/React style:

- strict-ish TypeScript with explicit domain/application types
- immutable updates for domain/application state
- small pure functions in domain
- dependency inversion via ports for browser APIs
- CSS/global styling consistent with current minimal UI
- no unrelated refactors in feature branches

Prefer existing helpers and patterns over new abstractions. Add abstraction only
when it removes real duplication or protects a clear boundary.

## Common Pitfalls

- Do not put browser APIs in `src/domain`.
- Do not bypass the image processing/storage fallback pipeline for uploads.
- Do not break saved-game restoration when adding first-run or preset flows.
- Do not duplicate backlog tasks; check existing IDs first.
- Do not move current iteration tasks to `Done` individually unless requested.
- Do not make arbitrary shuffled boards unless solvability is guaranteed.
- Do not assume uploaded images persist; large images may be in-memory only.
- Do not treat PWA service-worker behavior as fully verified in dev mode only.

## Release Notes

Versioning follows SemVer with `v` tags:

- `v0.(x+1).0` for new feature increments
- `v0.x.(y+1)` for fixes/small improvements

`package.json` stores the same version without the `v` prefix.

Definition of Done for an iteration:

- planned items are merged to `main`
- `npm run lint`, `npm test`, and `npm run build` are green
- demo is deployed and works
- `CHANGELOG.md` is updated
- git tag exists for the release
