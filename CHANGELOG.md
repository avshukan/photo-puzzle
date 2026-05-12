# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog.
Versioning follows SemVer.

## [v0.3.0] - 2026-05-12

### Added

- Shuffle button (restart puzzle with same image)
- Proper favicon

### Improved

- Upload validation uses `browser-image-validator`
- Large images are compressed and resized before storing (max 1024px, JPEG 0.75);
  small images are stored as-is
- Storage overflow handled gracefully (in-memory fallback with user notification)

### Fixed

- Files exceeding 10MB or 8000px are rejected with a clear error message
- Error and warning messages are shown to the user on upload failure or storage overflow

## [v0.2.0] - 2026-03-27

### Added

- Persist game state (tiles + image)
- Uploaded image survives reload
- Preview original image overlay

### Improved

- File upload UI (custom button)
- Victory modal UX (close button)
- Responsive puzzle board layout

### Fixed

- Double file selection on upload
- Board overflow on mobile

## [v0.1.0] - 2026-03-16

### Added

- Photo Puzzle MVP (15-puzzle) with a default image and local image upload.
- Fixed 4×4 board with one empty cell.
- Click-to-move controls (adjacent moves).
- Always solvable shuffle (random legal moves from solved state).
- Victory message on solved.
- Clean Architecture structure (domain / application / infrastructure / presentation).
- Unit tests for domain, use cases, and minimal UI.
- GitHub Pages deployment.
