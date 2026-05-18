# Iteration 3

## Goal

Make the game feel like a small installable app that is playable immediately,
even when the user does not have a suitable image to upload.

## Scope

All listed items are part of the iteration scope. The iteration priority helps
sequence work and manage risk; it does not mark items as optional.

|  ID | Title                                       | Type    | Priority | Notes                               |
| --: | ------------------------------------------- | ------- | -------- | ----------------------------------- |
|  41 | Add image picker with bundled presets       | Value   | High     | Gallery of preset images + upload   |
|  38 | Add PWA manifest                            | Value   | Medium   | App name, icons, theme color        |
|  44 | Improve controls layout for growing actions | Quality | Medium   | Keep top controls clear             |
|  45 | Add first-run image selection state         | Value   | Medium   | Offer preset or upload on first run |
|  39 | Add service worker for offline app shell    | Value   | Medium   | Open app offline after first load   |
|  40 | Add PWA installability checks               | Quality | Low      | Lighthouse or manual checklist      |
|  42 | Track image source type                     | Value   | Low      | Default, preset, or uploaded image  |
|  34 | Add random preset image action              | Value   | Medium   | Pick from bundled presets           |

## Preparation Analysis

### Scope readiness

- Iteration scope is fully mapped from backlog IDs 34, 38, 39, 40, 41, 42, 44, 45
- Scope is focused on two coherent tracks: preset onboarding and PWA app shell
- Out-of-scope items are fixed explicitly to avoid hidden expansion during delivery

### Delivery readiness

- Implementation order starts with PWA foundation (manifest, service worker, checks)
- UI-first-run flow tasks are scheduled after infrastructure to reduce integration risk
- Definition of Done covers behavior, compatibility with saved games, and test coverage

### Risk readiness

- Main risks are identified early: caching behavior, component growth, asset size
- Saved game compatibility and unified image source model are tracked as key safeguards
- Scope can be sliced by vertical increments if iteration capacity changes

## Out of Scope

- Difficulty labels for preset images (`43`)
- Board size selection (`5`)
- Move counter and timer (`2`, `3`)

## Key Decisions

The iteration has two product threads:

- preset images and the entry flow
- basic PWA support

Preset images should be bundled with the application instead of fetched from an
external random image source. This keeps the experience reliable, privacy-safe,
and compatible with future offline/PWA behavior.

PWA support should start with the app shell: manifest, icons, service worker,
and installability checks. Advanced offline behavior for user-uploaded images is
not part of this iteration.

## Target Behavior

### PWA

The app can be installed from supported browsers and opens in a standalone-like
mode with project-specific metadata and icons.

After the first successful load, the application shell can open without network
access.

### First Run

When there is no saved game, the user sees a clear choice:

- select one of the bundled preset images
- upload their own image

The user should be able to start a puzzle without having any local image file.

### Existing Game

When a saved game exists, the application restores it as before. The first-run
selection state must not interrupt an existing game.

### Image Picker

The image picker should make presets and upload feel like one coherent flow,
not two unrelated controls.

Expected actions:

- choose a bundled preset
- upload a custom image
- preview the current image
- shuffle/restart the current puzzle

### Random Preset

The user can quickly start a new game with a random bundled preset image.

## Implementation Order

1. Add PWA manifest (ID 38)
2. Add service worker for offline app shell (ID 39)
3. Add PWA installability checks (ID 40)
4. Improve controls layout (ID 44)
5. Add image picker with bundled presets (ID 41)
6. Track image source type (ID 42)
7. Add first-run image selection state (ID 45)
8. Add random preset image action (ID 34)

## Risks

- PWA caching can behave differently between development and production builds
- The image picker can grow too large for the current `GamePage` component
- Preset image assets may increase bundle size
- The first-run flow can accidentally interfere with saved game restoration
- Upload and preset paths may diverge if they are not modeled consistently
- The combined PWA + presets scope may need careful slicing to avoid a large UI
  and infrastructure change landing at the same time

## Definition of Done

- App has a valid web app manifest with project-specific metadata
- App shell can be opened offline after first successful load
- Basic PWA installability is checked manually or with Lighthouse
- User can start a game from a bundled preset image
- User can still upload a custom image
- Saved games continue to restore without showing first-run selection
- Current image source is represented explicitly enough for presets/uploads
- Top-level controls remain clear on mobile and desktop
- Random preset action starts a playable shuffled puzzle
- Existing tests pass, and new behavior has focused coverage

## Result

To be filled after implementation.

## Release

- Target version: v0.4.0
- Status: Planned
