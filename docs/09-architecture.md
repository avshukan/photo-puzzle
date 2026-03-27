# Architecture

The project follows **Clean Architecture** with clear separation of concerns.

## Layers

### Domain

- Pure business logic
- No dependencies on React, browser APIs, or infrastructure
- Contains:
  - puzzle rules (`canMove`, `applyMove`, `isSolved`)
  - shuffle logic

---

### Application

- Orchestrates domain logic
- Contains:
  - use cases (`StartGame`, `MoveTile`)
  - application model (`Game`)
  - ports (interfaces)

---

### Infrastructure

- Implements ports using browser APIs
- Contains:
  - `BrowserImageUrlAdapter` (File → data URL)
  - `LocalStorageGameStorageAdapter` (persistence)

---

### Presentation

- React UI
- Responsible for:
  - rendering
  - user interactions
  - calling application services

---

## Main flow

```text
User action (UI)
    ↓
GameService (application)
    ↓
Use cases (domain logic)
    ↓
Infrastructure (storage / image)
    ↓
UI update
```
