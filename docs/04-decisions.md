# Technical Decisions

- Grid size is fixed: 4×4.
- Internal representation: number[16].
- 0 represents the empty cell.
- Solved layout: [1..15, 0].
- Shuffle method: random legal moves from solved state.
- Control method: click on adjacent tile.
- No timer, no move counter, no reset button in MVP.
- Rendering: div tiles with background-image and background-position.
