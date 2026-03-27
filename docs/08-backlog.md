# Backlog

Rules:

- One list for everything: features, polish, refactors.
- Keep items small (1–4 hours each, whenever possible).
- Each item has: **ID**, **Title**, **Type**, **Priority**, **Notes**.

Legend:

- Type: `Value` | `Quality` | `Refactor`
- Priority: `High` (now) | `Medium` (next) | `Low` (later)

---

## Type meaning

- Value  
  User-facing value. Visible improvement. Adds or enhances functionality.

- Quality  
  Improves reliability, stability, or UX polish without adding new features.

- Refactor  
  Internal code changes without changing behavior. Improves structure and maintainability.

---

## How we work with backlog

1. Add new items with:
   - id
   - type
   - priority
   - notes

2. Regularly review priorities:
   - High = user pain / bugs
   - Medium = next iteration
   - Low = later / ideas

3. Before iteration:
   - pick 3–5 High/Medium items
   - prefer small tasks

4. During iteration:
   - move tasks from Todo → Doing
   - avoid adding new tasks

5. After completion:
   - move tasks to Done
   - update CHANGELOG if needed

---

## Doing

|  ID | Title                                             | Type     | Priority | Notes                                |
| --: | ------------------------------------------------- | -------- | -------- | ------------------------------------ |
| === | ================================================= | ======== | ======== | ==================================== |

---

## Todo

|  ID | Title                                             | Type     | Priority | Notes                                |
| --: | ------------------------------------------------- | -------- | -------- | ------------------------------------ |
| === | ================================================= | ======== | ======== | ==================================== |
|   1 | Add reset / new game button                       | Value    | Medium   | Use GameService.reset()              |
|   2 | Add move counter                                  | Value    | Low      | UI only                              |
|   3 | Add timer                                         | Value    | Low      | UI only                              |
|   5 | Add board size selector (4×4 / 5×3 / 5×5)         | Value    | Low      | Domain supports                      |
|   6 | Refactor PuzzleBoard styling to CSS module        | Refactor | Low      | Optional                             |
|  11 | Add proper favicon                                | Quality  | Medium   | Replace default                      |
|  12 | Split GamePage into smaller components            | Refactor | Medium   | Header, modal                        |
|  13 | Move inline styles to CSS modules                 | Quality  | Low      | Remove inline styles                 |
|  14 | Extract Upload control component                  | Refactor | Low      | Remove duplication                   |
|  15 | Add simple tile animations                        | Value    | Low      | CSS transitions                      |
|  16 | Add keyboard controls                             | Value    | Low      | Arrow keys                           |
|  17 | Disable interactions under modal/preview          | Quality  | Low      | Prevent background clicks            |
|  18 | Improve empty tile styling                        | Quality  | Low      | Better visual                        |
|  19 | Limit large image uploads                         | Quality  | Low      | Size / resize                        |
|  20 | Add loading state on upload                       | Quality  | Low      | User feedback                        |
|  21 | Add play again button in modal                    | Value    | Low      | Restart quickly                      |
|  22 | Add shareable puzzle URL                          | Value    | Low      | Future feature                       |
|  25 | Validate persisted game schema on load            | Quality  | Medium   | Handle schema changes                |
|  26 | Export component props types                      | Quality  | Medium   | Reuse props types across components  |
|  27 | Use component types in tests and mocks            | Quality  | Medium   | Improve test type safety             |
|  28 | Add unit tests for BrowserImageUrlAdapter         | Quality  | Medium   | FileReader logic untested            |
|  29 | Add focus trap in modals                          | Quality  | Low      | Accessibility improvement            |
|  30 | Compress / resize images before storing           | Quality  | Medium   | Prevent localStorage overflow        |

---

## Done

|  ID | Title                                             | Type     | Priority | Notes                                |
| --: | ------------------------------------------------- | -------- | -------- | ------------------------------------ |
| === | ================================================= | ======== | ======== | ==================================== |
|  23 | Restore image after reload                        | Value    | High     | Uploaded image survives reload       |
|   8 | Persist puzzle state (tiles, status)              | Value    | High     | Save/restore state                   |
|   9 | Improve file upload UI                            | Value    | High     | Custom button, layout                |
|  10 | Add preview original image                        | Value    | High     | Overlay preview                      |
|   4 | Add close button to victory modal                 | Value    | High     | Allow continue viewing               |
|  24 | Fix double file selection (opens twice) on upload | Quality  | High     | User must pick 2 times               |
|   7 | Fix board overflow on mobile                      | Value    | High     | Responsive tile size                 |

---

## Rejected

|  ID | Title                                             | Type     | Priority | Notes                                |
| --: | ------------------------------------------------- | -------- | -------- | ------------------------------------ |
| === | ================================================= | ======== | ======== | ==================================== |

---
