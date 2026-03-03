# Business Requirements (BRD-lite)

## Functional Requirements

FR-1. The system must auto-start the game with a default image.
FR-2. The system must allow uploading a local image file.
FR-3. The game must restart automatically after image upload.
FR-4. The board must always be 4×4 with 15 tiles and 1 empty cell.
FR-5. The image must be rendered via div + background-position.
FR-6. The initial position must always be solvable.
FR-7. Only tiles adjacent to the empty cell can be moved.
FR-8. The board state must update after a legal move.
FR-9. The system must detect solved state via strict comparison.
FR-10. The system must display a Victory message when solved.

## Non-functional Requirements

NFR-1. The project must follow Clean Architecture principles.
NFR-2. Domain logic must not depend on React or browser APIs.
NFR-3. Game rules must be deterministic.
NFR-4. The UI must respond instantly in modern browsers.
NFR-5. Images must never leave the browser.
NFR-6. The code must be easily extensible.
