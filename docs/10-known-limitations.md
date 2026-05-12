# Known Limitations

This document describes current technical and UX limitations of the project.

## Storage

- Game state is stored in `localStorage`
- Maximum available size is ~5MB (browser-dependent)
- Images are stored as data URLs (base64), which increases size by ~30–40%
- If storage fails (quota exceeded), the image is used in-memory only for the current session (no persistence)

---

## Upload

- Maximum file size: 10MB
- Maximum resolution: 8000px
- Files exceeding limits are rejected
- User sees an error message (no silent fallback)

---

## Images

- Images are compressed and resized before storing (max 1024px, JPEG 0.75)
- Images are stored as base64 (data URL), which increases size by ~30–40%
- Images that remain above 2MB after compression are not persisted (in-memory only)

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

- Very large images (near 2MB) may affect performance
- No lazy or background image processing

---

## Data validation

- Persisted game state is minimally validated on load
- Invalid or incompatible data is ignored and treated as "no saved game"

---

## Future improvements

Potential areas for improvement:

- Better accessibility (focus trap, keyboard navigation)
- Support for different board sizes
- Improved persistence strategy
