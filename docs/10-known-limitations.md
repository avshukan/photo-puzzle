# Known Limitations

This document describes current technical and UX limitations of the project.

## Storage

- Game state is stored in `localStorage`
- Maximum available size is ~5MB (browser-dependent)
- Images are stored as data URLs (base64), which increases size by ~30–40%
- If storage fails (quota exceeded), previous state may be cleared and replaced with a new one

---

## Upload

- Maximum file size: **10MB**
- Maximum resolution: **8000px**
- Files exceeding limits are rejected before processing
- User sees an error message on rejection

---

## Images

- Images are resized and compressed before storing
- Standard processing:
  - Resize to **1024px max**
  - JPEG quality **0.75**
- If needed, additional resize to **800px**
- Final image must fit into ~2MB (base64) to be stored
- If not, image is used without persistence

---

## Gameplay

- Fixed board size (4×4)
- No move counter
- No timer
- No difficulty levels

---

## Accessibility

- No focus trap in modals
- Limited keyboard support

---

## Performance

- Very large images (before processing) may cause short delays
- Image processing is done on the client (CPU-bound)

---

## Data validation

- Persisted game state is minimally validated on load
- Invalid or incompatible data is ignored and treated as "no saved game"

---

## Planned improvements (Iteration 2)

- Add shuffle button for quick restart
- Add proper favicon
- Improve error handling UX

---

## Future improvements

Potential areas for improvement:

- Better accessibility (focus trap, keyboard navigation)
- Support for different board sizes
- Improved persistence strategy
