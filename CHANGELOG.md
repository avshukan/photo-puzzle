# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog.
Versioning follows SemVer.

## [Unreleased]

### Added

- Preview original image overlay: a "Preview" button in the header opens the original puzzle image as a full-screen overlay. Close by clicking the backdrop or pressing Escape.

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
