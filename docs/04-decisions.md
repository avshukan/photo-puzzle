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

---

## Image handling (Iteration 2)

We use a 3-step model: **reject → normalize → fit**.

### 1. Input validation (reject early)

- Max file size: **10MB**
- Max resolution: **8000px** (width or height)

If exceeded:

- Reject file
- Show error to user

---

### 2. Processing (normalize)

Applied to all accepted images:

- Resize: **max 1024px** (longest side)
- Format: **JPEG**
- Quality: **0.75**

Goal:

- Reduce size
- Stabilize performance
- Fit into browser limits

---

### 3. Storage constraint (fit to localStorage)

- Target size: **≤ 2MB (base64)**

Algorithm:

1. Process image (1024px)
2. If size > 2MB → resize to **800px** → retry
3. If still > 2MB → do not store

---

### 4. Fallback behavior

If image cannot be stored:

- Do not save to localStorage
- Use image in-memory for current session

User is informed:

- “Image is too large to save. It will not persist after reload.”
