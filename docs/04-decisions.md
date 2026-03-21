# Technical Decisions

- Grid size in MVP is fixed: 4×4.
- Domain supports future rectangular boards via `width` / `height`.
- Internal representation: `tiles: number[]` with length `width * height`.
- `0` represents the empty cell.
- Solved layout: `[1..N-1, 0]`, where `N = width * height`.
- Shuffle method: random legal moves from solved state.
- Control method: click on adjacent tile (no diagonal moves).
- No timer, no move counter, no reset button in MVP.
- Rendering: HTML elements (buttons/divs) with background-image and background-position.
