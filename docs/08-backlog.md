# Backlog

Rules:

- One list for everything: features, polish, refactors.
- Keep items small (1–4 hours each, whenever possible).
- Each item has: **id**, **type**, **priority**, **notes**.

Legend:

- type: `Value` | `Quality` | `Refactor`
- priority: `High` (now) | `Medium` (next) | `Low` (later)

---

## Type meaning

- Value  
  Пользовательская ценность. Видно глазами. Улучшает UX или добавляет фичу.

- Quality  
  Улучшает качество без новой фичи.  
  Примеры: стабильность, ограничения, защита от ошибок, UX-полировка.

- Refactor  
  Изменение кода без изменения поведения.  
  Улучшает структуру, читаемость, расширяемость.

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

_(empty)_

---

## Todo

|  ID | Title                                      | Type     | Priority | Notes                     |
| --: | ------------------------------------------ | -------- | -------- | ------------------------- |
|   1 | Add reset / new game button                | Value    | Medium   | Without upload            |
|   2 | Add move counter                           | Value    | Low      | UI only                   |
|   3 | Add timer                                  | Value    | Low      | UI only                   |
|   4 | Add close button to victory modal          | Value    | High     | Allow continue viewing    |
|   5 | Add board size selector (4×4 / 5×3 / 5×5)  | Value    | Low      | Domain supports           |
|   6 | Refactor PuzzleBoard styling to CSS module | Refactor | Low      | Optional                  |
|   7 | Fix board overflow on mobile               | Value    | High     | Responsive tile size      |
|   8 | Persist puzzle state (tiles, status)       | Value    | High     | Save/restore state        |
|   9 | Improve file upload UI                     | Value    | High     | Custom button, layout     |
|  10 | Add preview original image                 | Value    | High     | Overlay preview           |
|  11 | Add proper favicon                         | Quality  | Medium   | Replace default           |
|  12 | Split GamePage into smaller components     | Refactor | Medium   | Header, modal             |
|  13 | Move inline styles to CSS modules          | Quality  | Low      | Remove inline styles      |
|  14 | Extract Upload control component           | Refactor | Low      | Remove duplication        |
|  15 | Add simple tile animations                 | Value    | Low      | CSS transitions           |
|  16 | Add keyboard controls                      | Value    | Low      | Arrow keys                |
|  17 | Disable interactions under modal/preview   | Quality  | Low      | Prevent background clicks |
|  18 | Improve empty tile styling                 | Quality  | Low      | Better visual             |
|  19 | Limit large image uploads                  | Quality  | Low      | Size / resize             |
|  20 | Add loading state on upload                | Quality  | Low      | User feedback             |
|  22 | Add shareable puzzle URL                   | Value    | Low      | Future feature            |
|  23 | Add play again button in modal             | Value    | Low      | Restart quickly           |
|  24 | Restore image after reload                 | Quality  | Medium   | Handle blob fallback      |

---

## Done

_(empty)_
